import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculatePERatio } from "@/utils/calculators";
import { formatNumber, formatCurrency } from "@/utils/formatters";

export function PERatioPage() {
  const { t } = useI18n();
  const tt = t.tools.peRatio;

  const [stockPrice, setStockPrice] = useState(150);
  const [eps, setEps] = useState(10);
  const [industryPE, setIndustryPE] = useState(15);

  const result = calculatePERatio(stockPrice, eps, industryPE);

  const valuationLabel = tt[result.valuation];
  const valuationClass =
    result.valuation === "overvalued"
      ? "danger"
      : result.valuation === "undervalued"
        ? "success"
        : "warning";

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title"><InputIcon width={18} height={18} /> {t.common.input}</div>
          <InputField
            label={tt.stockPrice}
            type="number"
            value={stockPrice}
            onChange={(e) => setStockPrice(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.eps}
            type="number"
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            suffix="฿"
            min={0}
            step={0.01}
          />
          <InputField
            label={tt.industryPE}
            type="number"
            value={industryPE}
            onChange={(e) => setIndustryPE(Number(e.target.value))}
            min={0}
            step={0.1}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setStockPrice(150);
                setEps(10);
                setIndustryPE(15);
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
              <span className="label">{tt.peRatio}</span>
              <span className="value">{formatNumber(result.peRatio)}</span>
            </div>
            <div className="result-item">
              <span className="label">{tt.fairValue}</span>
              <span className="value">{formatCurrency(result.fairValue)}</span>
            </div>
            <div className="result-item">
              <span className="label">{tt.valuation}</span>
              <span className={`badge ${valuationClass}`}>
                {valuationLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
