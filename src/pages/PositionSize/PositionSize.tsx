import { useState } from "react";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculatePositionSize } from "@/utils/calculators";
import { formatCurrency, formatNumber } from "@/utils/formatters";

export function PositionSizePage() {
  const { t } = useI18n();
  const tt = t.tools.positionSize;

  const [accountSize, setAccountSize] = useState(1000000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(50);
  const [stopLoss, setStopLoss] = useState(45);

  const result = calculatePositionSize(
    accountSize,
    riskPercent,
    entryPrice,
    stopLoss,
  );

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title">📥 {t.common.input}</div>
          <InputField
            label={tt.accountSize}
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.riskPercent}
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            suffix="%"
            min={0}
            max={100}
            step={0.1}
          />
          <InputField
            label={tt.entryPrice}
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.stopLoss}
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setAccountSize(1000000);
                setRiskPercent(2);
                setEntryPrice(50);
                setStopLoss(45);
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
              <span className="label">{tt.positionShares}</span>
              <span className="value">
                {formatNumber(result.positionShares, 0)} {t.common.shares}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.riskAmount}</span>
              <span className="value negative">
                {formatCurrency(result.riskAmount)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.positionValue}</span>
              <span className="value">
                {formatCurrency(result.positionValue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
