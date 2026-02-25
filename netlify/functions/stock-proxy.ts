/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handler } from "@netlify/functions";
import https from "https";

// Helper function to make HTTP GET requests using native Node.js https module
const fetchHttps = (url: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "application/json",
          },
        },
        (res) => {
          if (
            res.statusCode &&
            (res.statusCode < 200 || res.statusCode >= 300)
          ) {
            reject(new Error(`Status: ${res.statusCode}`));
            return;
          }
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        },
      )
      .on("error", (err) => {
        reject(err);
      });
  });
};

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
    let url = "";

    if (type === "quote" && ticker) {
      url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
    } else if (type === "history" && ticker && years) {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${years}y&interval=1mo`;
    } else if (type === "search" && query) {
      url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        query,
      )}&quotesCount=10&newsCount=0`;
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid parameters" }),
      };
    }

    // Fetch from Yahoo Finance using native HTTPS
    const data = await fetchHttps(url);

    const parsedData = data as any;

    // Map output to match frontend expectations
    let mappedData;

    if (type === "quote") {
      mappedData = parsedData?.quoteResponse?.result?.[0] || null;
    } else if (type === "history") {
      const timestamps = parsedData?.chart?.result?.[0]?.timestamp || [];
      const closePrices =
        parsedData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
      const points = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (closePrices[i] != null) {
          const dateObj = new Date(timestamps[i] * 1000);
          points.push({
            date: dateObj.toISOString().split("T")[0],
            close: closePrices[i],
          });
        }
      }
      mappedData = points;
    } else if (type === "search") {
      mappedData = { quotes: parsedData?.quotes || [] };
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
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
