import { useState } from "react";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { SelectField } from "@/components/ui/Select/Select";
import { Button } from "@/components/ui/Button/Button";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { calculateCompoundInterest } from "@/utils/calculators";
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

export function CompoundInterestPage() {
  const { t } = useI18n();
  const tt = t.tools.compoundInterest;

  const [principal, setPrincipal] = useState(100000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [freq, setFreq] = useState("12");

  const result = calculateCompoundInterest(
    principal,
    monthly,
    rate,
    years,
    Number(freq),
  );

  const freqOptions = [
    { value: "12", label: tt.monthly },
    { value: "4", label: tt.quarterly },
    { value: "2", label: tt.semiAnnually },
    { value: "1", label: tt.annually },
  ];

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title">
            <InputIcon width={18} height={18} /> {t.common.input}
          </div>
          <InputField
            label={tt.principal}
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.monthlyContribution}
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.annualRate}
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            suffix="%"
            min={0}
            step={0.1}
          />
          <InputField
            label={tt.years}
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            suffix={t.common.years}
            min={1}
            max={50}
          />
          <SelectField
            label={tt.compoundFrequency}
            options={freqOptions}
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setPrincipal(100000);
                setMonthly(5000);
                setRate(8);
                setYears(20);
                setFreq("12");
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
          <div className="result-grid">
            <div className="result-item">
              <span className="label">{tt.futureValue}</span>
              <span className="value positive">
                {formatCurrency(result.futureValue)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.totalContributions}</span>
              <span className="value">
                {formatCurrency(result.totalContributions)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.totalInterest}</span>
              <span className="value positive">
                {formatCurrency(result.totalInterest)}
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
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stackId="1"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  name={tt.totalContributions}
                />
                <Area
                  type="monotone"
                  dataKey="interest"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name={tt.totalInterest}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
