import { useState } from "react";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculateComparison } from "@/utils/calculators";
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
  const { t } = useI18n();
  const tt = t.tools.investmentCompare;

  const [amountA, setAmountA] = useState(500000);
  const [rateA, setRateA] = useState(8);
  const [yearsA, setYearsA] = useState(10);
  const [amountB, setAmountB] = useState(500000);
  const [rateB, setRateB] = useState(12);
  const [yearsB, setYearsB] = useState(10);

  const result = calculateComparison(
    amountA,
    rateA,
    yearsA,
    amountB,
    rateB,
    yearsB,
  );
  const winnerLabel =
    result.winner === "A"
      ? tt.investmentA
      : result.winner === "B"
        ? tt.investmentB
        : "-";

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title">🅰️ {tt.investmentA}</div>
          <InputField
            label={tt.amount}
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
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

          <div
            className="section-title"
            style={{ marginTop: "var(--space-lg)" }}
          >
            🅱️ {tt.investmentB}
          </div>
          <InputField
            label={tt.amount}
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
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

          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setAmountA(500000);
                setRateA(8);
                setYearsA(10);
                setAmountB(500000);
                setRateB(12);
                setYearsB(10);
              }}
            >
              {t.common.reset}
            </Button>
          </div>
        </div>

        <div className="result-section">
          <div className="section-title">📊 {t.common.results}</div>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">
                {tt.investmentA} — {tt.finalValue}
              </span>
              <span className="value">{formatCurrency(result.valueA)}</span>
            </div>
            <div className="result-item">
              <span className="label">
                {tt.investmentB} — {tt.finalValue}
              </span>
              <span className="value">{formatCurrency(result.valueB)}</span>
            </div>
            <div className="result-item">
              <span className="label">{tt.difference}</span>
              <span className="value">{formatCurrency(result.difference)}</span>
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
                  tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
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
                  name={tt.investmentA}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="valueB"
                  fill="#e11d48"
                  name={tt.investmentB}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
