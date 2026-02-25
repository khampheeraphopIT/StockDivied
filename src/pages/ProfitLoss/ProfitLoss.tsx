import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculateProfitLoss } from "@/utils/calculators";
import { formatCurrency, formatPercent } from "@/utils/formatters";

export function ProfitLossPage() {
  const { t } = useI18n();
  const tt = t.tools.profitLoss;

  const [buyPrice, setBuyPrice] = useState(50);
  const [sellPrice, setSellPrice] = useState(65);
  const [quantity, setQuantity] = useState(1000);
  const [commission, setCommission] = useState(150);

  const result = calculateProfitLoss(buyPrice, sellPrice, quantity, commission);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title"><InputIcon width={18} height={18} /> {t.common.input}</div>
          <InputField
            label={tt.buyPrice}
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.sellPrice}
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <InputField
            label={tt.quantity}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={0}
          />
          <InputField
            label={tt.commission}
            type="number"
            value={commission}
            onChange={(e) => setCommission(Number(e.target.value))}
            suffix="฿"
            min={0}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setBuyPrice(50);
                setSellPrice(65);
                setQuantity(1000);
                setCommission(150);
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
              <span className="label">{tt.grossPL}</span>
              <span
                className={`value ${result.grossPL >= 0 ? "positive" : "negative"}`}
              >
                {formatCurrency(result.grossPL)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.netPL}</span>
              <span
                className={`value ${result.netPL >= 0 ? "positive" : "negative"}`}
              >
                {formatCurrency(result.netPL)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.roi}</span>
              <span
                className={`value ${result.roi >= 0 ? "positive" : "negative"}`}
              >
                {formatPercent(result.roi)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.breakEvenPrice}</span>
              <span className="value">
                {formatCurrency(result.breakEvenPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
