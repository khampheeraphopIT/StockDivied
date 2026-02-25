import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculateCAGR } from "@/utils/calculators";
import {
  formatCurrency,
  formatPercent,
  formatMultiplier,
} from "@/utils/formatters";

export function CAGRPage() {
  const { t } = useI18n();
  const tt = t.tools.cagr;

  const [beginValue, setBeginValue] = useState(100000);
  const [endValue, setEndValue] = useState(250000);
  const [years, setYears] = useState(5);

  const result = calculateCAGR(beginValue, endValue, years);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title"><InputIcon width={18} height={18} /> {t.common.input}</div>
          <InputField
            label={tt.beginValue}
            type="number"
            value={beginValue}
            onChange={(e) => setBeginValue(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.endValue}
            type="number"
            value={endValue}
            onChange={(e) => setEndValue(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.years}
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            suffix={t.common.years}
            min={1}
            max={100}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setBeginValue(100000);
                setEndValue(250000);
                setYears(5);
              }}
            >
              {t.common.reset}
            </Button>
          </div>
        </div>

        <div className="result-section">
          <div className="section-title"><ChartBarIcon width={18} height={18} /> {t.common.results}</div>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">{tt.cagrResult}</span>
              <span
                className={`value ${result.cagr >= 0 ? "positive" : "negative"}`}
              >
                {formatPercent(result.cagr)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.absoluteReturn}</span>
              <span
                className={`value ${result.absoluteReturn >= 0 ? "positive" : "negative"}`}
              >
                {formatCurrency(result.absoluteReturn)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.totalGrowth}</span>
              <span className="value">
                {formatMultiplier(result.totalGrowth)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
