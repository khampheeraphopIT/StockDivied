import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import https from "https";

import { type Connect } from "vite";
import http from "http";

/* ─── Yahoo Finance helper (same cookie+crumb approach as Netlify function) ── */
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
    const options: https.RequestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/json,*/*",
        ...extraHeaders,
      },
    };
    https
      .get(options, (res) => {
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
        res.on("data", (chunk: string) => (data += chunk));
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

let _cookie = "";
let _crumb = "";
let _cacheTs = 0;
const CACHE_TTL = 25 * 60 * 1000;

async function getYahooAuth(): Promise<{ cookie: string; crumb: string }> {
  if (_cookie && _crumb && Date.now() - _cacheTs < CACHE_TTL) {
    return { cookie: _cookie, crumb: _crumb };
  }
  const step1 = await httpsGet("https://fc.yahoo.com/");
  const cookie = step1.setCookie.map((c) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("No Yahoo cookie");

  const step2 = await httpsGet(
    "https://query2.finance.yahoo.com/v1/test/getcrumb",
    { Cookie: cookie },
  );
  const crumb = step2.body.trim();
  if (!crumb || crumb === "Unauthorized" || step2.status >= 400) {
    throw new Error(`Crumb failed: ${step2.status}`);
  }
  _cookie = cookie;
  _crumb = crumb;
  _cacheTs = Date.now();
  return { cookie, crumb };
}

async function yahooFetch(url: string): Promise<unknown> {
  const { cookie, crumb } = await getYahooAuth();
  const sep = url.includes("?") ? "&" : "?";
  const fullUrl = `${url}${sep}crumb=${encodeURIComponent(crumb)}`;
  const res = await httpsGet(fullUrl, { Cookie: cookie });
  if (res.status >= 400) {
    _cacheTs = 0;
    const retry = await getYahooAuth();
    const retryUrl = `${url}${sep}crumb=${encodeURIComponent(retry.crumb)}`;
    const res2 = await httpsGet(retryUrl, { Cookie: retry.cookie });
    if (res2.status >= 400) throw new Error(`Yahoo ${res2.status}`);
    return JSON.parse(res2.body);
  }
  return JSON.parse(res.body);
}

/* ─── Vite Plugin ── */
const yahooFinancePlugin = () => ({
  name: "yahoo-finance-api",
  configureServer(server: { middlewares: Connect.Server }) {
    server.middlewares.use(
      "/api/stock",
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        try {
          const requestUrl = req.url || "/";
          const host = req.headers.host || "localhost";
          const url = new URL(requestUrl, `http://${host}`);
          const ticker = url.searchParams.get("ticker");
          const type = url.searchParams.get("type");

          if (!ticker) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing ticker" }));
            return;
          }

          let result;
          if (type === "quote") {
            const data = (await yahooFetch(
              `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`,
            )) as { quoteResponse?: { result?: unknown[] } };
            result = data?.quoteResponse?.result?.[0] ?? null;
          } else if (type === "history") {
            const years = Number(url.searchParams.get("years")) || 5;
            const data = (await yahooFetch(
              `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${years}y&interval=1mo`,
            )) as {
              chart?: {
                result?: {
                  timestamp?: number[];
                  indicators?: {
                    quote?: { close?: (number | null)[] }[];
                  };
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
          } else if (type === "search") {
            const data = (await yahooFetch(
              `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(ticker)}&quotesCount=10&newsCount=0`,
            )) as { quotes?: unknown[] };
            result = { quotes: data?.quotes ?? [] };
          } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid type" }));
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          console.error("Yahoo API Error:", msg);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: msg }));
        }
      },
    );
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), yahooFinancePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
