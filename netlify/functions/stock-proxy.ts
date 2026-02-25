import { Handler } from "@netlify/functions";
import https from "https";

/* ────────────────────────────────────────────
 * Low-level HTTPS helper (no external deps)
 * ──────────────────────────────────────────── */
interface HttpResult {
  status: number;
  body: string;
  setCookie: string[];
}

function httpsGet(
  url: string,
  extraHeaders: Record<string, string> = {},
): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/json,*/*",
        "Accept-Language": "en-US,en;q=0.9",
        ...extraHeaders,
      },
    };
    https
      .get(options, (res) => {
        // Follow redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          httpsGet(res.headers.location, extraHeaders)
            .then(resolve)
            .catch(reject);
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode || 500,
            body: data,
            setCookie: (res.headers["set-cookie"] as string[]) || [],
          }),
        );
      })
      .on("error", reject);
  });
}

/* ────────────────────────────────────────────
 * Yahoo Cookie + Crumb authentication flow
 * ──────────────────────────────────────────── */
let _cookie = "";
let _crumb = "";
let _cacheTs = 0;
const CACHE_TTL = 25 * 60 * 1000; // 25 min

async function getYahooAuth(): Promise<{ cookie: string; crumb: string }> {
  if (_cookie && _crumb && Date.now() - _cacheTs < CACHE_TTL) {
    return { cookie: _cookie, crumb: _crumb };
  }

  // Step 1 – hit fc.yahoo.com to get a consent cookie
  const step1 = await httpsGet("https://fc.yahoo.com/");
  const rawCookies = step1.setCookie;
  const cookie = rawCookies.map((c) => c.split(";")[0]).join("; ");

  if (!cookie) throw new Error("No Yahoo cookie received");

  // Step 2 – exchange cookie for a crumb token
  const step2 = await httpsGet(
    "https://query2.finance.yahoo.com/v1/test/getcrumb",
    { Cookie: cookie },
  );

  const crumb = step2.body.trim();
  if (!crumb || crumb === "Unauthorized" || step2.status >= 400) {
    throw new Error(`Crumb fetch failed: ${step2.status} ${crumb}`);
  }

  _cookie = cookie;
  _crumb = crumb;
  _cacheTs = Date.now();
  return { cookie, crumb };
}

/* ────────────────────────────────────────────
 * Authenticated Yahoo Finance fetch
 * ──────────────────────────────────────────── */
async function yahooFetch(url: string): Promise<unknown> {
  const { cookie, crumb } = await getYahooAuth();
  const separator = url.includes("?") ? "&" : "?";
  const fullUrl = `${url}${separator}crumb=${encodeURIComponent(crumb)}`;
  const res = await httpsGet(fullUrl, { Cookie: cookie });
  if (res.status >= 400) {
    // Invalidate cache and retry once
    _cacheTs = 0;
    const retry = await getYahooAuth();
    const retryUrl = `${url}${separator}crumb=${encodeURIComponent(retry.crumb)}`;
    const res2 = await httpsGet(retryUrl, { Cookie: retry.cookie });
    if (res2.status >= 400) {
      throw new Error(
        `Yahoo returned ${res2.status}: ${res2.body.substring(0, 200)}`,
      );
    }
    return JSON.parse(res2.body);
  }
  return JSON.parse(res.body);
}

/* ────────────────────────────────────────────
 * Netlify Handler
 * ──────────────────────────────────────────── */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  const { type, ticker, years, query } = event.queryStringParameters || {};

  try {
    let result: unknown;

    /* ── Quote ── */
    if (type === "quote" && ticker) {
      const data = (await yahooFetch(
        `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`,
      )) as { quoteResponse?: { result?: Record<string, unknown>[] } };
      result = data?.quoteResponse?.result?.[0] ?? null;

      /* ── Historical ── */
    } else if (type === "history" && ticker && years) {
      const data = (await yahooFetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${years}y&interval=1mo`,
      )) as {
        chart?: {
          result?: {
            timestamp?: number[];
            indicators?: { quote?: { close?: (number | null)[] }[] };
          }[];
        };
      };
      const chart = data?.chart?.result?.[0];
      const timestamps = chart?.timestamp ?? [];
      const closes = chart?.indicators?.quote?.[0]?.close ?? [];
      const points: { date: string; close: number }[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (closes[i] != null) {
          const d = new Date(timestamps[i] * 1000);
          points.push({
            date: d.toISOString().split("T")[0],
            close: closes[i] as number,
          });
        }
      }
      result = points;

      /* ── Search ── */
    } else if (type === "search" && query) {
      const data = (await yahooFetch(
        `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
      )) as { quotes?: unknown[] };
      result = { quotes: data?.quotes ?? [] };
    } else {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: "Invalid parameters" }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify(result),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("stock-proxy error:", msg);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: msg }),
    };
  }
};
