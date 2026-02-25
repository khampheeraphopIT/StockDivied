import { Handler } from "@netlify/functions";
import yahooFinance from "yahoo-finance2";

export const handler: Handler = async (event) => {
  const { type, ticker, years, query } = event.queryStringParameters || {};

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    let mappedData;

    if (type === "quote" && ticker) {
      // Fetch quote
      const quote = await yahooFinance.quote(ticker);
      mappedData = quote || null;
    } else if (type === "history" && ticker && years) {
      // Fetch historical data
      const period1 = new Date();
      period1.setFullYear(period1.getFullYear() - Number(years));

      const queryOptions = {
        period1: period1,
        period2: new Date(),
        interval: "1mo" as const,
      };

      const result = (await yahooFinance.historical(
        ticker,
        queryOptions,
      )) as unknown as { date: Date; close: number }[];

      mappedData = result.map((p: { date: Date; close: number }) => ({
        date: p.date.toISOString().split("T")[0],
        close: p.close,
      }));
    } else if (type === "search" && query) {
      // Fetch search
      const result = (await yahooFinance.search(query, {
        quotesCount: 10,
        newsCount: 0,
      })) as unknown as Record<string, unknown[]>;
      mappedData = { quotes: result.quotes || [] };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid parameters" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mappedData),
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed fetching data from Yahoo Finance",
      }),
    };
  }
};
