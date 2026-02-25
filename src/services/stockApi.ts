const isDev = import.meta.env.DEV;
const NETLIFY_API = "/.netlify/functions/stock-proxy";

// Type definitions remain unchanged
export interface StockQuote {
  ticker: string;
  price: number;
  currency: string;
  name: string;
  eps: number | null;
  pe: number | null;
  dividendYield: number | null;
  dividendRate: number | null;
}

export interface HistoricalDataPoint {
  timestamp: number;
  date: string;
  price: number;
}

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
 * Helper to fetch data either via local Vite proxy during dev,
 * or via Netlify Serverless Function in production.
 */
async function fetchStockData(params: string) {
  const url = isDev ? `/api/stock?${params}` : `${NETLIFY_API}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Proxy Error: ${res.status}`);
  return await res.json();
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
    const result = await fetchStockData(`type=quote&ticker=${ticker}`);
    return result?.regularMarketPrice || result?.preMarketPrice || 0;
  } catch (err) {
    console.error("Failed to fetch exchange rate", err);
    return 1; // Fallback to 1 to prevent NaNs
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
    return await fetchHistoricalData(ticker, years);
  } catch (err) {
    console.error("Failed to fetch historical exchange rates", err);
    return [];
  }
};

/**
 * Fetch current quote and key statistics for a ticker
 */
export const fetchCurrentQuote = async (
  ticker: string,
): Promise<StockQuote> => {
  const result = await fetchStockData(
    `type=quote&ticker=${ticker.toUpperCase()}`,
  );
  if (!result) throw new Error("Ticker not found");

  return {
    ticker: result.symbol,
    price:
      result.regularMarketPrice || result.preMarketPrice || result.price || 0,
    currency: result.currency || "USD",
    name: result.shortName || result.longName || result.symbol,
    eps: result.epsTrailingTwelveMonths || null,
    pe: result.trailingPE || result.forwardPE || null,
    dividendYield: result.trailingAnnualDividendYield
      ? result.trailingAnnualDividendYield * 100
      : result.dividendYield || null,
    dividendRate:
      result.trailingAnnualDividendRate || result.dividendRate || null,
  };
};

/**
 * Fetch historical monthly closing prices for N years
 */
export const fetchHistoricalData = async (
  ticker: string,
  years: number,
): Promise<HistoricalDataPoint[]> => {
  const result = await fetchStockData(
    `type=history&ticker=${ticker.toUpperCase()}&years=${years}`,
  );
  if (!Array.isArray(result)) throw new Error("Data not found");

  return result
    .map((p: Record<string, unknown>) => ({
      timestamp: new Date(String(p.date)).getTime(),
      date: new Date(String(p.date)).toISOString().split("T")[0],
      price: Number(p.close),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Search for tickers using Yahoo Finance autocomplete API
 */
export const searchStocks = async (query: string): Promise<SearchQuote[]> => {
  if (!query) return [];

  try {
    const result = await fetchStockData(
      `type=search&ticker=${encodeURIComponent(query)}`,
    );
    if (!result?.quotes) return [];

    return result.quotes.map((q: Record<string, unknown>) => ({
      symbol: String(q.symbol || ""),
      shortname: String(q.shortname || q.longname || q.symbol || ""),
      longname: String(q.longname || q.shortname || q.symbol || ""),
      exchange: String(q.exchange || ""),
      quoteType: String(q.quoteType || "EQUITY"),
      industry: String(q.industry || ""),
      sector: String(q.sector || ""),
    }));
  } catch (err) {
    console.error("Failed searchStocks", err);
    return [];
  }
};
