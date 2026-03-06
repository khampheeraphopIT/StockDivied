import { useState, useEffect } from "react";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";
import { useQuery } from "@tanstack/react-query";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import {
  fetchCurrentQuote,
  fetchCurrentExchangeRate,
} from "@/services/stockApi";
import { getConversionRate } from "@/utils/currency";
import { calculatePERatio } from "@/utils/calculators";
import {
  formatNumber,
  formatCurrency,
  getCurrencySymbol,
} from "@/utils/formatters";
import { PERatioContent } from "./PERatioContent";

export function PERatioPage() {
  const { t, currency } = useI18n();
  const tt = t.tools.peRatio;

  const [stockPrice, setStockPrice] = useState(150);
  const [eps, setEps] = useState(10);
  const [industryPE, setIndustryPE] = useState(15);

  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: quote,
    isFetching: loadingQuote,
    error: quoteError,
  } = useQuery({
    queryKey: ["quote", selectedTicker],
    queryFn: () => fetchCurrentQuote(selectedTicker!),
    enabled: !!selectedTicker,
  });

  const { data: exchangeRate, isFetching: loadingRate } = useQuery({
    queryKey: ["exchangeRate", "USD", "THB"],
    queryFn: () => fetchCurrentExchangeRate("USD", "THB"),
  });

  useEffect(() => {
    if (quote && exchangeRate) {
      const conversionRate = getConversionRate(
        quote.currency,
        currency,
        exchangeRate,
      );
      // eslint-disable-next-line
      setStockPrice(quote.price * conversionRate);
      if (quote.eps) setEps(quote.eps * conversionRate);
    }
  }, [quote, exchangeRate, currency]); // Auto-update

  const handleStockSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setError(null);
  };

  const isLoading = loadingQuote || loadingRate;
  const displayError =
    error || (quoteError ? (quoteError as Error).message : null);

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
            error={displayError}
          />
          <hr
            style={{ margin: "1rem 0", borderColor: "rgba(255,255,255,0.06)" }}
          />

          <InputField
            label={tt.stockPrice}
            type="number"
            value={stockPrice}
            onChange={(e) => setStockPrice(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.eps}
            type="number"
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
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
              <span className="value">
                {formatCurrency(result.fairValue, currency)}
              </span>
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
      <PERatioContent />
      <AdBanner />
    </div>
  );
}
