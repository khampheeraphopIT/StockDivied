import { useState } from "react";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculateBreakEven } from "@/utils/calculators";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getCurrencySymbol,
} from "@/utils/formatters";

export function BreakEvenPage() {
  const { t, currency } = useI18n();
  const tt = t.tools.breakEven;

  const [fixedCosts, setFixedCosts] = useState(500000);
  const [variableCost, setVariableCost] = useState(30);
  const [pricePerUnit, setPricePerUnit] = useState(100);
  const [currentSales, setCurrentSales] = useState(10000);

  const result = calculateBreakEven(
    fixedCosts,
    variableCost,
    pricePerUnit,
    currentSales,
  );

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
            label={tt.fixedCosts}
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.variableCost}
            type="number"
            value={variableCost}
            onChange={(e) => setVariableCost(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.pricePerUnit}
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.currentSales}
            type="number"
            value={currentSales}
            onChange={(e) => setCurrentSales(Number(e.target.value))}
            suffix={t.common.units}
            min={0}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setFixedCosts(500000);
                setVariableCost(30);
                setPricePerUnit(100);
                setCurrentSales(10000);
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
              <span className="label">{tt.breakEvenUnits}</span>
              <span className="value">
                {formatNumber(result.breakEvenUnits, 0)} {t.common.units}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.breakEvenRevenue}</span>
              <span className="value">
                {formatCurrency(result.breakEvenRevenue, currency)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.marginOfSafety}</span>
              <span
                className={`badge ${result.marginOfSafety > 0 ? "success" : "danger"}`}
              >
                {formatPercent(result.marginOfSafety)}
              </span>
            </div>
          </div>
        </div>
        <AdBanner />
      </div>
    </div>
  );
}
