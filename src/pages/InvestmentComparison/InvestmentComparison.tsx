import { useState } from "react";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import {
  fetchHistoricalData,
  fetchHistoricalExchangeRates,
} from "@/services/stockApi";
import {
  calculateComparison,
  calculateRealComparison,
  type ComparisonResult,
  type RealComparisonResult,
} from "@/utils/calculators";
import { formatCurrency } from "@/utils/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function InvestmentComparisonPage() {
  const { t, locale } = useI18n();
  const tt = t.tools.investmentCompare;

  const [mode, setMode] = useState<"fixed" | "real">("fixed");

  // Shared inputs
  const [amountA, setAmountA] = useState(500000);
  const [amountB, setAmountB] = useState(500000);
  const [sharedYears, setSharedYears] = useState(10); // for Real Stock mode

  // Fixed mode inputs
  const [rateA, setRateA] = useState(8);
  const [yearsA, setYearsA] = useState(10);
  const [rateB, setRateB] = useState(12);
  const [yearsB, setYearsB] = useState(10);

  // Real mode state
  const [tickerA, setTickerA] = useState<string | null>(null);
  const [historyA, setHistoryA] = useState<
    { timestamp: number; price: number }[]
  >([]);
  const [loadingA, setLoadingA] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);

  const [tickerB, setTickerB] = useState<string | null>(null);
  const [historyB, setHistoryB] = useState<
    { timestamp: number; price: number }[]
  >([]);
  const [loadingB, setLoadingB] = useState(false);
  const [errorB, setErrorB] = useState<string | null>(null);

  const handleStockA = async (ticker: string) => {
    setLoadingA(true);
    setErrorA(null);
    try {
      const [stockData, exchangeData] = await Promise.all([
        fetchHistoricalData(ticker, sharedYears),
        fetchHistoricalExchangeRates("USD", "THB", sharedYears),
      ]);
      if (stockData.length === 0) throw new Error("No data");

      const thbData = stockData.map((p) => {
        const yearMonth = p.date.substring(0, 7);
        const matchedRate = exchangeData.find(
          (r) => r.date.substring(0, 7) === yearMonth,
        );
        const rate = matchedRate ? matchedRate.price : 34.0;
        return { timestamp: p.timestamp, date: p.date, price: p.price * rate };
      });

      setHistoryA(thbData);
      setTickerA(ticker);
    } catch (err) {
      setErrorA(err instanceof Error ? err.message : "Failed");
      setHistoryA([]);
      setTickerA(null);
    } finally {
      setLoadingA(false);
    }
  };

  const handleStockB = async (ticker: string) => {
    setLoadingB(true);
    setErrorB(null);
    try {
      const [stockData, exchangeData] = await Promise.all([
        fetchHistoricalData(ticker, sharedYears),
        fetchHistoricalExchangeRates("USD", "THB", sharedYears),
      ]);
      if (stockData.length === 0) throw new Error("No data");

      const thbData = stockData.map((p) => {
        const yearMonth = p.date.substring(0, 7);
        const matchedRate = exchangeData.find(
          (r) => r.date.substring(0, 7) === yearMonth,
        );
        const rate = matchedRate ? matchedRate.price : 34.0;
        return { timestamp: p.timestamp, date: p.date, price: p.price * rate };
      });

      setHistoryB(thbData);
      setTickerB(ticker);
    } catch (err) {
      setErrorB(err instanceof Error ? err.message : "Failed");
      setHistoryB([]);
      setTickerB(null);
    } finally {
      setLoadingB(false);
    }
  };

  const isReal = mode === "real";

  const fixedResult = calculateComparison(
    amountA,
    rateA,
    yearsA,
    amountB,
    rateB,
    yearsB,
  );
  const realResult = calculateRealComparison(
    amountA,
    historyA,
    amountB,
    historyB,
  );

  const result: ComparisonResult | RealComparisonResult = isReal
    ? realResult
    : fixedResult;

  const winnerLabel =
    result.winner === "A"
      ? isReal && tickerA
        ? tickerA.toUpperCase()
        : tt.investmentA
      : result.winner === "B"
        ? isReal && tickerB
          ? tickerB.toUpperCase()
          : tt.investmentB
        : "-";

  const nameA = isReal && tickerA ? tickerA.toUpperCase() : tt.investmentA;
  const nameB = isReal && tickerB ? tickerB.toUpperCase() : tt.investmentB;

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant={mode === "fixed" ? "primary" : "secondary"}
              onClick={() => setMode("fixed")}
              style={{ flex: 1 }}
            >
              {locale === "th" ? "อิงผลตอบแทนคงที่" : "Fixed Return"}
            </Button>
            <Button
              variant={mode === "real" ? "primary" : "secondary"}
              onClick={() => {
                setMode("real");
                if (historyA.length === 0 && tickerA) handleStockA(tickerA);
                if (historyB.length === 0 && tickerB) handleStockB(tickerB);
              }}
              style={{ flex: 1 }}
            >
              {locale === "th" ? "เปรียบเทียบหุ้นจริง" : "Compare Real Stocks"}
            </Button>
          </div>

          {isReal && (
            <div style={{ marginBottom: "1rem" }}>
              <InputField
                label={tt.years}
                type="number"
                value={sharedYears}
                onChange={(e) => {
                  setSharedYears(Number(e.target.value));
                  setHistoryA([]);
                  setHistoryB([]); // requires refetch
                }}
                suffix={t.common.years}
                min={1}
                max={50}
              />
            </div>
          )}

          <div className="section-title">
            {isReal
              ? locale === "th"
                ? "สินทรัพย์ A"
                : "Asset A"
              : tt.investmentA}
          </div>
          <InputField
            label={tt.amount}
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(Number(e.target.value))}
            suffix={t.common.currency}
            min={0}
          />

          {isReal ? (
            <StockSelector
              onSelect={handleStockA}
              isLoading={loadingA}
              error={errorA}
              label={locale === "th" ? "หุ้น A (Ticker)" : "Stock A (Ticker)"}
            />
          ) : (
            <>
              <InputField
                label={tt.rate}
                type="number"
                value={rateA}
                onChange={(e) => setRateA(Number(e.target.value))}
                suffix="%"
                min={0}
                step={0.1}
              />
              <InputField
                label={tt.years}
                type="number"
                value={yearsA}
                onChange={(e) => setYearsA(Number(e.target.value))}
                suffix={t.common.years}
                min={1}
                max={50}
              />
            </>
          )}

          <hr
            style={{
              margin: "1.5rem 0",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          />

          <div className="section-title">
            {isReal
              ? locale === "th"
                ? "สินทรัพย์ B"
                : "Asset B"
              : tt.investmentB}
          </div>
          <InputField
            label={tt.amount}
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(Number(e.target.value))}
            suffix={t.common.currency}
            min={0}
          />

          {isReal ? (
            <StockSelector
              onSelect={handleStockB}
              isLoading={loadingB}
              error={errorB}
              label={locale === "th" ? "หุ้น B (Ticker)" : "Stock B (Ticker)"}
            />
          ) : (
            <>
              <InputField
                label={tt.rate}
                type="number"
                value={rateB}
                onChange={(e) => setRateB(Number(e.target.value))}
                suffix="%"
                min={0}
                step={0.1}
              />
              <InputField
                label={tt.years}
                type="number"
                value={yearsB}
                onChange={(e) => setYearsB(Number(e.target.value))}
                suffix={t.common.years}
                min={1}
                max={50}
              />
            </>
          )}

          <div className="button-row" style={{ marginTop: "1.5rem" }}>
            <Button
              variant="secondary"
              onClick={() => {
                setAmountA(500000);
                setAmountB(500000);
                if (isReal) {
                  setSharedYears(10);
                  setTickerA(null);
                  setHistoryA([]);
                  setErrorA(null);
                  setTickerB(null);
                  setHistoryB([]);
                  setErrorB(null);
                } else {
                  setRateA(8);
                  setYearsA(10);
                  setRateB(12);
                  setYearsB(10);
                }
              }}
            >
              {t.common.reset}
            </Button>
          </div>
        </div>

        <div className="result-section">
          <div className="section-title">
            <ChartBarIcon width={18} height={18} /> {t.common.results}
          </div>

          {isReal && (historyA.length === 0 || historyB.length === 0) ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}
            >
              {locale === "th"
                ? "กรุณาค้นหาและเลือกหุ้นทั้ง A และ B ด้านซ้ายมือเพื่อดูผลลัพธ์"
                : "Please search and select both Stock A and B to view results."}
            </div>
          ) : (
            <>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">
                    {nameA} — {tt.finalValue}
                  </span>
                  <span className="value">{formatCurrency(result.valueA)}</span>
                </div>
                <div className="result-item">
                  <span className="label">
                    {nameB} — {tt.finalValue}
                  </span>
                  <span className="value">{formatCurrency(result.valueB)}</span>
                </div>
                <div className="result-item">
                  <span className="label">{tt.difference}</span>
                  <span className="value">
                    {formatCurrency(result.difference)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">{tt.winner}</span>
                  <span className="badge success">{winnerLabel}</span>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={result.yearlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                      }}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Bar
                      dataKey="valueA"
                      fill="#6366f1"
                      name={nameA}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="valueB"
                      fill="#e11d48"
                      name={nameB}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
