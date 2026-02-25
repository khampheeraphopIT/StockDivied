/* eslint-disable @typescript-eslint/no-explicit-any */
const isDev = import.meta.env.DEV;
const PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://api.codetabs.com/v1/proxy/?quest=",
];

async function fetchWithProxy(targetUrl: string): Promise<Response> {
  let lastError: Error | null = null;

  for (const proxy of PROXIES) {
    try {
      const url = `${proxy}${encodeURIComponent(targetUrl)}`;
      const res = await fetch(url);
      if (res.ok) return res;
      throw new Error(`Proxy ${proxy} returned ${res.status}`);
    } catch (err: unknown) {
      lastError = err as Error;
      console.warn((err as Error).message);
      // Try next proxy
    }
  }

  throw lastError || new Error("All proxies failed");
}

export interface StockQuote {
  ticker: string;
  price: number;
  currency: string;
  name: string;
  eps: number | null;
  pe: number | null;
  dividendYield: number | null; // percentage e.g., 1.5
  dividendRate: number | null; // absolute value e.g., $2.50
}

export interface HistoricalDataPoint {
  timestamp: number; // unix timestamp in ms
  date: string; // YYYY-MM-DD
  price: number;
}

/**
 * Fetch the current USD to THB exchange rate
 */
export const fetchCurrentExchangeRate = async (
  from = "USD",
  to = "THB",
): Promise<number> => {
  const ticker = `${from}${to}=X`;
  try {
    if (isDev) {
      const res = await fetch(`/api/stock?type=quote&ticker=${ticker}`);
      if (!res.ok) throw new Error("Local proxy failed");
      const result = await res.json();
      return result.regularMarketPrice || result.preMarketPrice || 0;
    }

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
    const res = await fetchWithProxy(url);
    const data = await res.json();
    const result = data?.quoteResponse?.result?.[0];
    return result?.regularMarketPrice || 0;
  } catch (err) {
    console.error("Failed to fetch exchange rate", err);
    return 1; // Fallback to 1 if it fails to prevent NaNs
  }
};

/**
 * Fetch historical exchange rates for exact month-to-month alignment
 */
export const fetchHistoricalExchangeRates = async (
  from = "USD",
  to = "THB",
  years = 10,
): Promise<HistoricalDataPoint[]> => {
  const ticker = `${from}${to}=X`;
  try {
    // We can reuse the existing `fetchHistoricalData` logic
    return await fetchHistoricalData(ticker, years);
  } catch (err) {
    console.error("Failed to fetch historical exchange rates", err);
    return []; // Return empty array as fallback
  }
};

/**
 * Fetch current quote and key statistics for a ticker
 */
export const fetchCurrentQuote = async (
  ticker: string,
): Promise<StockQuote> => {
  if (isDev) {
    const res = await fetch(`/api/stock?type=quote&ticker=${ticker}`);
    if (!res.ok) throw new Error("Local proxy failed");
    const result = await res.json();

    return {
      ticker: result.symbol,
      price: result.regularMarketPrice || result.preMarketPrice || 0,
      currency: result.currency || "USD",
      name: result.shortName || result.longName || result.symbol,
      eps: result.epsTrailingTwelveMonths || null,
      pe: result.trailingPE || null,
      dividendYield: result.trailingAnnualDividendYield
        ? result.trailingAnnualDividendYield * 100
        : null,
      dividendRate: result.trailingAnnualDividendRate || null,
    };
  }

  // Production fallback to CORS proxy
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker.toUpperCase()}`;
  const res = await fetchWithProxy(url);
  const data = await res.json();
  const result = data?.quoteResponse?.result?.[0];
  if (!result) throw new Error("Ticker not found");

  return {
    ticker: result.symbol,
    price: result.regularMarketPrice || 0,
    currency: result.currency || "USD",
    name: result.shortName || result.longName || result.symbol,
    eps: result.epsTrailingTwelveMonths || null,
    pe: result.trailingPE || null,
    dividendYield: result.trailingAnnualDividendYield
      ? result.trailingAnnualDividendYield * 100
      : null,
    dividendRate: result.trailingAnnualDividendRate || null,
  };
};

/**
 * Fetch historical monthly closing prices for N years
 */
export const fetchHistoricalData = async (
  ticker: string,
  years: number,
): Promise<HistoricalDataPoint[]> => {
  if (isDev) {
    const res = await fetch(
      `/api/stock?type=history&ticker=${ticker}&years=${years}`,
    );
    if (!res.ok) throw new Error("Local proxy failed");
    const result = await res.json();

    return result
      .map((p: Record<string, unknown>) => ({
        timestamp: new Date(String(p.date)).getTime(),
        date: new Date(String(p.date)).toISOString().split("T")[0],
        price: Number(p.close),
      }))
      .sort(
        (a: HistoricalDataPoint, b: HistoricalDataPoint) =>
          a.timestamp - b.timestamp,
      );
  }

  // Production fallback
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker.toUpperCase()}?range=${years}y&interval=1mo`;
  const res = await fetchWithProxy(url);
  const data = await res.json();

  const result = data?.chart?.result?.[0];
  if (!result) throw new Error("Data not found");

  const timestamps = result.timestamp || [];
  const closePrices = result.indicators?.quote?.[0]?.close || [];
  const points: HistoricalDataPoint[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    if (closePrices[i] != null) {
      const dateObj = new Date(timestamps[i] * 1000);
      points.push({
        timestamp: dateObj.getTime(),
        date: dateObj.toISOString().split("T")[0],
        price: closePrices[i],
      });
    }
  }

  points.sort((a, b) => a.timestamp - b.timestamp);
  return points;
};

export interface SearchQuote {
  symbol: string;
  shortname: string;
  longname: string;
  exchange: string;
  quoteType: string;
  industry?: string;
  sector?: string;
}

/**
 * Search for tickers using Yahoo Finance autocomplete API
 */
export const searchStocks = async (query: string): Promise<SearchQuote[]> => {
  if (!query) return [];

  if (isDev) {
    const res = await fetch(`/api/stock?type=search&ticker=${query}`);
    if (!res.ok) return [];
    const result = await res.json();

    return result.quotes.map((q: Record<string, unknown>) => ({
      symbol: String(q.symbol || ""),
      shortname: String(q.shortname || q.longname || ""),
      longname: String(q.longname || q.shortname || ""),
      exchange: String(q.exchange || ""),
      quoteType: String(q.quoteType || ""),
      industry: String(q.industry || ""),
      sector: String(q.sector || ""),
    }));
  }

  // Production fallback
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
  const res = await fetchWithProxy(url);
  const data = await res.json();

  if (!data?.quotes) return [];
  return data.quotes
    .filter(
      (q: Record<string, unknown>) =>
        q.quoteType === "EQUITY" ||
        q.quoteType === "ETF" ||
        q.quoteType === "MUTUALFUND",
    )
    .map((q: Record<string, unknown>) => ({
      symbol: String(q.symbol || ""),
      shortname: String(q.shortname || q.longname || ""),
      longname: String(q.longname || q.shortname || ""),
      exchange: String(q.exchange || ""),
      quoteType: String(q.quoteType || ""),
      industry: String(q.industry || ""),
      sector: String(q.sector || ""),
    }));
};
