import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import yahooFinanceStatic from "yahoo-finance2";

import { type Connect } from "vite";
import http from "http";
// Initialize the yahoo-finance2 instance (v3 requirement)
const yahooFinance = new yahooFinanceStatic({
  suppressNotices: ["yahooSurvey"],
});

const yahooFinancePlugin = () => ({
  name: "yahoo-finance-api",
  configureServer(server: { middlewares: Connect.Server }) {
    server.middlewares.use(
      "/api/stock",
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        try {
          // req.url can be undefined in some cases, provide a fallback
          const requestUrl = req.url || "/";
          // req.headers.host can be undefined, provide a fallback
          const host = req.headers.host || "localhost";
          const url = new URL(requestUrl, `http://${host}`);
          const ticker = url.searchParams.get("ticker");
          const type = url.searchParams.get("type"); // 'quote', 'history', 'search'

          if (!ticker) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing ticker" }));
            return;
          }

          let result;
          if (type === "search") {
            result = await yahooFinance.search(ticker);
          } else if (type === "quote") {
            result = await yahooFinance.quote(ticker);
          } else if (type === "history") {
            const years = Number(url.searchParams.get("years")) || 5;
            const period1 = new Date();
            period1.setFullYear(period1.getFullYear() - years);

            const chartResult = await yahooFinance.chart(ticker, {
              period1: period1,
              interval: "1mo",
            });
            result = chartResult.quotes;
          } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid type" }));
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          console.error("Yahoo API Error:", errorMessage);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: errorMessage }));
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
