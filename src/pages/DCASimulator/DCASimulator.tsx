import { useState, useMemo } from "react";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";
import { useQuery } from "@tanstack/react-query";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import {
  fetchHistoricalData,
  fetchCurrentQuote,
  fetchCurrentExchangeRate,
} from "@/services/stockApi";
import { getConversionRate } from "@/utils/currency";
import { calculateDCA, type DCAResult } from "@/utils/calculators";
import { formatCurrency, getCurrencySymbol } from "@/utils/formatters";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * Derive the CAGR (Compound Annual Growth Rate) from historical price data.
 * Returns the annualized return as a percentage, e.g. 12.5 for 12.5%/year.
 */
function deriveCAGR(prices: { timestamp: number; price: number }[]): number {
  if (prices.length < 2) return 0;
  const firstPrice = prices[0].price;
  const lastPrice = prices[prices.length - 1].price;
  if (firstPrice <= 0) return 0;
  const startDate = new Date(prices[0].timestamp);
  const endDate = new Date(prices[prices.length - 1].timestamp);
  const yearsElapsed =
    (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (yearsElapsed <= 0) return 0;
  const cagr = (Math.pow(lastPrice / firstPrice, 1 / yearsElapsed) - 1) * 100;
  return cagr;
}

export function DCASimulatorPage() {
  const { t, locale, currency } = useI18n();
  const tt = t.tools.dcaSimulator;

  const [mode, setMode] = useState<"fixed" | "real">("fixed");

  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [years, setYears] = useState(10);
  const [initial, setInitial] = useState(50000);

  const [error, setError] = useState<string | null>(null);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const { data: quote } = useQuery({
    queryKey: ["quote", selectedTicker],
    queryFn: () => fetchCurrentQuote(selectedTicker!),
    enabled: !!selectedTicker,
  });

  // Always fetch the maximum history to get the best CAGR estimate
  const {
    data: stockData,
    isFetching: loadingStock,
    error: stockError,
  } = useQuery({
    queryKey: ["history", selectedTicker, 30],
    queryFn: () => fetchHistoricalData(selectedTicker!, 30),
    enabled: !!selectedTicker,
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchangeRate", "USD", "THB"],
    queryFn: () => fetchCurrentExchangeRate("USD", "THB"),
  });

  const handleStockSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setError(null);
  };

  // Derive CAGR from historical data
  const derivedCAGR = useMemo(() => {
    if (!stockData || stockData.length < 2 || !quote || !exchangeRate) return 0;

    // Convert first and last price to current selected currency before deriving CAGR
    // This handles Thai stocks correctly (already in THB)
    const conversionRate = getConversionRate(
      quote.currency,
      currency,
      exchangeRate,
    );
    const convertedPrices = stockData.map((p) => ({
      ...p,
      price: p.price * conversionRate,
    }));

    return deriveCAGR(convertedPrices);
  }, [stockData, quote, exchangeRate, currency]);

  const dataYears = useMemo(() => {
    if (!stockData || stockData.length < 2) return 0;
    const startDate = new Date(stockData[0].timestamp);
    const endDate = new Date(stockData[stockData.length - 1].timestamp);
    return (
      (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
  }, [stockData]);

  const isLoading = loadingStock;
  const displayError =
    error ||
    (stockData && stockData.length === 0
      ? "No data found for this timeframe"
      : stockError
        ? (stockError as Error).message
        : null);

  const isReal = mode === "real";

  // In both modes, we use calculateDCA with:
  // - Fixed mode: user-entered annualReturn
  // - Real mode: derived CAGR from historical stock data
  const effectiveReturn =
    isReal && derivedCAGR > 0 ? derivedCAGR : annualReturn;

  const result: DCAResult = calculateDCA(
    monthlyInvestment,
    effectiveReturn,
    years,
    initial,
  );

  const modeLabelFixed =
    locale === "th" ? "อิงผลตอบแทนคงที่ (%)" : "Fixed Return Rate (%)";
  const modeLabelReal =
    locale === "th" ? "อิงราคาหุ้นในอดีต" : "Real Historical Stock";

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title">
            <InputIcon width={18} height={18} /> {t.common.input}
          </div>

          {/* Mode Toggle */}
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
              {modeLabelFixed}
            </Button>
            <Button
              variant={mode === "real" ? "primary" : "secondary"}
              onClick={() => {
                setMode("real");
              }}
              style={{ flex: 1 }}
            >
              {modeLabelReal}
            </Button>
          </div>

          <InputField
            label={tt.initialInvestment}
            type="number"
            value={initial}
            onChange={(e) => setInitial(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.monthlyInvestment}
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.years}
            type="number"
            value={years}
            onChange={(e) => {
              const y = Number(e.target.value);
              setYears(y);
            }}
            suffix={t.common.years}
            min={1}
            max={50}
          />

          <hr
            style={{ margin: "1rem 0", borderColor: "rgba(255,255,255,0.06)" }}
          />

          {isReal ? (
            <StockSelector
              onSelect={handleStockSelect}
              isLoading={isLoading}
              error={displayError}
              label={
                locale === "th"
                  ? `เลือกหุ้นเพื่อดึงผลตอบแทนเฉลี่ย`
                  : `Select Stock for Avg. Return`
              }
            />
          ) : (
            <InputField
              label={tt.annualReturn}
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              suffix="%"
              min={0}
              step={0.1}
            />
          )}

          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setMonthlyInvestment(5000);
                setAnnualReturn(10);
                setYears(10);
                setInitial(50000);
                setSelectedTicker(null);
                setError(null);
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

          {isReal && !selectedTicker ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}
            >
              {locale === "th"
                ? "กรุณาค้นหาและเลือกหุ้นที่ต้องการจำลอง DCA ด้านซ้ายมือ"
                : "Please search and select a stock to simulate DCA."}
            </div>
          ) : (
            <>
              {/* Show derived CAGR info when in real mode */}
              {isReal && derivedCAGR > 0 && selectedTicker && (
                <div
                  style={{
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    backgroundColor: "rgba(6, 182, 212, 0.1)",
                    border: "1px solid rgba(6, 182, 212, 0.25)",
                    borderRadius: "8px",
                    color: "#67e8f9",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {locale === "th" ? (
                    <>
                      📊 หุ้น <strong>{selectedTicker.toUpperCase()}</strong>{" "}
                      มีข้อมูลย้อนหลัง{" "}
                      <strong>{dataYears.toFixed(1)} ปี</strong> →
                      ผลตอบแทนเฉลี่ยต่อปี (CAGR):{" "}
                      <strong
                        style={{
                          color: derivedCAGR >= 0 ? "#4ade80" : "#f87171",
                        }}
                      >
                        {derivedCAGR.toFixed(2)}%
                      </strong>
                      <br />
                      ระบบนำ CAGR นี้ไปคำนวณการลงทุน DCA{" "}
                      <strong>{years} ปีข้างหน้า</strong> ให้คุณ
                    </>
                  ) : (
                    <>
                      📊 <strong>{selectedTicker.toUpperCase()}</strong> has{" "}
                      <strong>{dataYears.toFixed(1)} years</strong> of data →
                      Average annual return (CAGR):{" "}
                      <strong
                        style={{
                          color: derivedCAGR >= 0 ? "#4ade80" : "#f87171",
                        }}
                      >
                        {derivedCAGR.toFixed(2)}%
                      </strong>
                      <br />
                      Projecting DCA for the next <strong>
                        {years} years
                      </strong>{" "}
                      using this return rate.
                    </>
                  )}
                </div>
              )}

              <div className="result-grid">
                <div className="result-item">
                  <span className="label">{tt.totalInvested}</span>
                  <span className="value">
                    {formatCurrency(result.totalInvested, currency)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">
                    {locale === "th"
                      ? "มูลค่าพอร์ต (DCA)"
                      : "Portfolio Value (DCA)"}
                    {isReal && selectedTicker
                      ? ` — ${selectedTicker.toUpperCase()}`
                      : ""}
                  </span>
                  <span className="value positive">
                    {formatCurrency(result.portfolioValue, currency)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">{tt.totalReturn}</span>
                  <span
                    className={`value ${result.totalReturn >= 0 ? "positive" : "negative"}`}
                  >
                    {formatCurrency(result.totalReturn, currency)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">
                    {locale === "th"
                      ? "กำไรจาก DCA เทียบกับเก็บเงินสด"
                      : "DCA Profit vs. Holding Cash"}
                  </span>
                  <span
                    className={`value ${result.totalReturn >= 0 ? "positive" : "negative"}`}
                  >
                    {result.totalInvested > 0
                      ? `+${((result.totalReturn / result.totalInvested) * 100).toFixed(1)}%`
                      : "0%"}
                  </span>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={result.yearlyData}>
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
                      formatter={(value) =>
                        formatCurrency(Number(value), currency)
                      }
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.15}
                      name={
                        locale === "th"
                          ? "เก็บเงินสด (ไม่ลงทุน)"
                          : "Cash Savings (No Investment)"
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="dca"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                      name={
                        locale === "th" ? "มูลค่าพอร์ต DCA" : "DCA Portfolio"
                      }
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
        <AdBanner />
      </div>
    </div>
  );
}
