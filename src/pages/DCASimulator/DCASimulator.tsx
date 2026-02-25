import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import { fetchHistoricalData } from "@/services/stockApi";
import {
  calculateDCA,
  calculateRealDCA,
  type DCAResult,
  type RealDCAResult,
} from "@/utils/calculators";
import { formatCurrency } from "@/utils/formatters";
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

export function DCASimulatorPage() {
  const { t, locale } = useI18n();
  const tt = t.tools.dcaSimulator;

  const [mode, setMode] = useState<"fixed" | "real">("fixed");

  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [years, setYears] = useState(10);
  const [initial, setInitial] = useState(50000);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalPrices, setHistoricalPrices] = useState<
    { timestamp: number; price: number }[]
  >([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleStockSelect = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchHistoricalData(ticker, years);
      if (data.length === 0)
        throw new Error("No data found for this timeframe");
      setHistoricalPrices(data);
      setSelectedTicker(ticker);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch historical data",
      );
      setHistoricalPrices([]);
      setSelectedTicker(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isReal = mode === "real";

  const fixedResult = calculateDCA(
    monthlyInvestment,
    annualReturn,
    years,
    initial,
  );
  const realResult = calculateRealDCA(
    monthlyInvestment,
    initial,
    historicalPrices,
  );

  // Use real result if in real mode and we have data, otherwise fallback (or show fixed)
  const result: DCAResult | RealDCAResult =
    isReal && historicalPrices.length > 0 ? realResult : fixedResult;

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
                if (historicalPrices.length === 0 && selectedTicker) {
                  handleStockSelect(selectedTicker); // Try fetch if switched back
                }
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
            suffix={t.common.currency}
            min={0}
          />
          <InputField
            label={tt.monthlyInvestment}
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            suffix={t.common.currency}
            min={0}
          />
          <InputField
            label={tt.years}
            type="number"
            value={years}
            onChange={(e) => {
              const y = Number(e.target.value);
              setYears(y);
              if (isReal && selectedTicker) {
                // Changing years requires refetching history
                setHistoricalPrices([]);
              }
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
              error={error}
              label={
                locale === "th"
                  ? `จำลองมูลค่าด้วยหุ้น (${years} ปี)`
                  : `Simulate with Stock (${years} Yrs)`
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
                setHistoricalPrices([]);
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

          {isReal && historicalPrices.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}
            >
              {locale === "th"
                ? "กรุณาค้นหาและเลือกหุ้นที่ต้องการจำลอง DCA ด้านซ้ายมือ"
                : "Please search and select a stock to simulate DCA."}
            </div>
          ) : (
            <>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">{tt.totalInvested}</span>
                  <span className="value">
                    {formatCurrency(result.totalInvested)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">
                    {tt.portfolioValue}
                    {isReal && selectedTicker
                      ? ` (${selectedTicker.toUpperCase()})`
                      : " (DCA)"}
                  </span>
                  <span className="value positive">
                    {formatCurrency(result.portfolioValue)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">{tt.totalReturn}</span>
                  <span
                    className={`value ${result.totalReturn >= 0 ? "positive" : "negative"}`}
                  >
                    {formatCurrency(result.totalReturn)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="label">{tt.vsLumpSum}</span>
                  <span className="value">
                    {formatCurrency(result.lumpSumValue)}
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
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke="#64748b"
                      fill="#64748b"
                      fillOpacity={0.2}
                      name={tt.totalInvested}
                    />
                    <Area
                      type="monotone"
                      dataKey={isReal ? "dcaValue" : "dca"}
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                      name="DCA"
                    />
                    <Area
                      type="monotone"
                      dataKey={isReal ? "lumpSumValue" : "lumpSum"}
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.15}
                      name={tt.vsLumpSum}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
