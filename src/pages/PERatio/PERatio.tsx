import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import { fetchCurrentQuote } from "@/services/stockApi";
import { calculatePERatio } from "@/utils/calculators";
import { formatNumber, formatCurrency } from "@/utils/formatters";

export function PERatioPage() {
  const { t } = useI18n();
  const tt = t.tools.peRatio;

  const [stockPrice, setStockPrice] = useState(150);
  const [eps, setEps] = useState(10);
  const [industryPE, setIndustryPE] = useState(15);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSelect = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const quote = await fetchCurrentQuote(ticker);
      setStockPrice(quote.price);
      if (quote.eps) setEps(quote.eps);
      // P/E ratio is derived from price / eps, but we don't automatically override industry PE
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch stock data",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="section-title">
            <InputIcon width={18} height={18} /> {t.common.input}
          </div>

          <StockSelector
            onSelect={handleStockSelect}
            isLoading={isLoading}
            error={error}
          />
          <hr
            style={{ margin: "1rem 0", borderColor: "rgba(255,255,255,0.06)" }}
          />

          <InputField
            label={tt.stockPrice}
            type="number"
            value={stockPrice}
            onChange={(e) => setStockPrice(Number(e.target.value))}
            suffix={t.common.currency}
            min={0}
          />
          <InputField
            label={tt.eps}
            type="number"
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            suffix={t.common.currency}
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
