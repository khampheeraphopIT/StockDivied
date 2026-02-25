import { useState, useEffect } from "react";
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
import { calculatePositionSize } from "@/utils/calculators";
import {
  formatCurrency,
  formatNumber,
  getCurrencySymbol,
} from "@/utils/formatters";

export function PositionSizePage() {
  const { t, locale, currency } = useI18n();
  const tt = t.tools.positionSize;

  const [accountSize, setAccountSize] = useState(1000000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(50);
  const [stopLoss, setStopLoss] = useState(45);

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
      const finalRate = currency === "USD" ? 1 : exchangeRate;
      const convertedPrice = quote.price * finalRate;
      // eslint-disable-next-line
      setEntryPrice(convertedPrice);
      // Auto-set stop loss to 5% below entry price as a starting point
      setStopLoss(Number((convertedPrice * 0.95).toFixed(2)));
    }
  }, [quote, exchangeRate, currency]); // Sync values when currency toggle changes

  const handleStockSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setError(null);
  };

  const isLoading = loadingQuote || loadingRate;
  const displayError =
    error || (quoteError ? (quoteError as Error).message : null);

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
            error={displayError}
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
            suffix={getCurrencySymbol(currency)}
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
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.stopLoss}
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
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
                {formatCurrency(result.riskAmount, currency)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.positionValue}</span>
              <span className="value">
                {formatCurrency(result.positionValue, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
