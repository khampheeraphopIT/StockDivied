import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import { fetchCurrentQuote } from "@/services/stockApi";
import { calculatePositionSize } from "@/utils/calculators";
import { formatCurrency, formatNumber } from "@/utils/formatters";

export function PositionSizePage() {
  const { t, locale } = useI18n();
  const tt = t.tools.positionSize;

  const [accountSize, setAccountSize] = useState(1000000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(50);
  const [stopLoss, setStopLoss] = useState(45);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSelect = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const quote = await fetchCurrentQuote(ticker);
      setEntryPrice(quote.price);
      // Auto-set stop loss to 5% below entry price as a starting point
      setStopLoss(Number((quote.price * 0.95).toFixed(2)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch stock data",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="section-title">
            <InputIcon width={18} height={18} /> {t.common.input}
          </div>

          <StockSelector
            onSelect={handleStockSelect}
            isLoading={isLoading}
            error={error}
            label={
              locale === "th"
                ? "ดึงราคาปัจจุบันเป็นราคาเข้า (ใส่ Ticker)"
                : "Fetch Current Price as Entry Price"
            }
          />
          <hr
            style={{ margin: "1rem 0", borderColor: "rgba(255,255,255,0.06)" }}
          />

          <InputField
            label={tt.accountSize}
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(Number(e.target.value))}
            suffix={t.common.currency}
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
            suffix={t.common.currency}
            min={0}
          />
          <InputField
            label={tt.stopLoss}
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            suffix={t.common.currency}
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
