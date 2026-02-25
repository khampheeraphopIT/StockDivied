import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { StockSelector } from "@/components/ui/StockSelector/StockSelector";
import {
  fetchHistoricalData,
  fetchHistoricalExchangeRates,
} from "@/services/stockApi";
import { calculateCAGR } from "@/utils/calculators";
import {
  formatCurrency,
  formatPercent,
  formatMultiplier,
  getCurrencySymbol,
} from "@/utils/formatters";

export function CAGRPage() {
  const { t, locale, currency } = useI18n();
  const tt = t.tools.cagr;

  const [beginValue, setBeginValue] = useState(100000);
  const [endValue, setEndValue] = useState(250000);
  const [years, setYears] = useState(5);

  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: stockData,
    isFetching: loadingStock,
    error: stockError,
  } = useQuery({
    queryKey: ["history", selectedTicker, years],
    queryFn: () => fetchHistoricalData(selectedTicker!, years),
    enabled: !!selectedTicker,
  });

  const { data: exchangeData, isFetching: loadingExchange } = useQuery({
    queryKey: ["exchangeHistory", "USD", "THB", years],
    queryFn: () => fetchHistoricalExchangeRates("USD", "THB", years),
  });

  useEffect(() => {
    if (stockData && exchangeData && stockData.length >= 2) {
      const convertedData = stockData.map((p) => {
        const yearMonth = p.date.substring(0, 7);
        const matchedRate = exchangeData.find(
          (r) => r.date.substring(0, 7) === yearMonth,
        );
        const baseRate = matchedRate ? matchedRate.price : 34.0;
        const finalRate = currency === "USD" ? 1 : baseRate;
        return {
          timestamp: p.timestamp,
          date: p.date,
          price: p.price * finalRate,
        };
      });

      // eslint-disable-next-line
      setBeginValue(convertedData[0].price);
      setEndValue(convertedData[convertedData.length - 1].price);
    }
  }, [stockData, exchangeData, currency, years]);

  const handleStockSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setError(null);
  };

  const isLoading = loadingStock || loadingExchange;
  const displayError =
    error ||
    (stockData && stockData.length < 2
      ? "Not enough historical data for this timeframe"
      : stockError
        ? (stockError as Error).message
        : null);

  const result = calculateCAGR(beginValue, endValue, years);

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
                ? `ดึงข้อมูลย้อนหลัง ${years} ปี (ใส่ Ticker)`
                : `Fetch ${years}-Year History (Type Ticker)`
            }
          />
          <hr
            style={{ margin: "1rem 0", borderColor: "rgba(255,255,255,0.06)" }}
          />

          <InputField
            label={tt.beginValue}
            type="number"
            value={beginValue}
            onChange={(e) => setBeginValue(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.endValue}
            type="number"
            value={endValue}
            onChange={(e) => setEndValue(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
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
                {formatCurrency(result.absoluteReturn, currency)}
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
