import { useState } from "react";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { calculateDividend } from "@/utils/calculators";
import { formatCurrency, formatPercent } from "@/utils/formatters";

export function DividendCalculatorPage() {
  const { t } = useI18n();
  const tt = t.tools.dividendCalc;

  const [sharePrice, setSharePrice] = useState(100);
  const [annualDividend, setAnnualDividend] = useState(5);
  const [sharesOwned, setSharesOwned] = useState(1000);
  const [taxRate, setTaxRate] = useState(10);

  const result = calculateDividend(
    sharePrice,
    annualDividend,
    sharesOwned,
    taxRate,
  );

  const handleReset = () => {
    setSharePrice(100);
    setAnnualDividend(5);
    setSharesOwned(1000);
    setTaxRate(10);
  };

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
            label={tt.sharePrice}
            type="number"
            value={sharePrice}
            onChange={(e) => setSharePrice(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.annualDividend}
            type="number"
            value={annualDividend}
            onChange={(e) => setAnnualDividend(Number(e.target.value))}
            suffix="฿"
            min={0}
            step={0.01}
          />
          <InputField
            label={tt.sharesOwned}
            type="number"
            value={sharesOwned}
            onChange={(e) => setSharesOwned(Number(e.target.value))}
            suffix={t.common.shares}
            min={0}
          />
          <InputField
            label={tt.taxRate}
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            suffix="%"
            min={0}
            max={100}
          />
          <div className="button-row">
            <Button variant="secondary" onClick={handleReset}>
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
              <span className="label">{tt.dividendYield}</span>
              <span className="value">
                {formatPercent(result.dividendYield)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.annualIncome}</span>
              <span className="value positive">
                {formatCurrency(result.annualIncome)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.monthlyIncome}</span>
              <span className="value positive">
                {formatCurrency(result.monthlyIncome)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.afterTaxIncome}</span>
              <span className="value">
                {formatCurrency(result.afterTaxIncome)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
