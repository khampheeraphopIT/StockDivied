import { useState, useId, useRef, useEffect } from "react";
import { type StockInfo, POPULAR_STOCKS } from "@/constants/stocks";
import { searchStocks, type SearchQuote } from "@/services/stockApi";
import styles from "./StockSelector.module.css";
import { useI18n } from "@/i18n";

/** Strip exchange suffixes (.BK, =F, =X) for clean display */
function displayTicker(ticker: string): string {
  return ticker
    .replace(/\.(BK|TO|L|AX|HK|SI|KS|TW|NS|BO)$/i, "")
    .replace(/=.+$/, "");
}

interface StockSelectorProps {
  label?: string;
  onSelect: (ticker: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function StockSelector({
  label,
  onSelect,
  isLoading = false,
  error = null,
}: StockSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState<StockInfo[]>(
    POPULAR_STOCKS.slice(0, 10),
  );
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();
  const id = useId();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    const query = inputValue.trim();
    if (!query) {
      setSearchResults(POPULAR_STOCKS.slice(0, 10)); // Default view
      setIsSearching(false);
      return;
    }

    // Filter local list immediately for instant feedback
    const localMatches = POPULAR_STOCKS.filter(
      (s) =>
        s.ticker.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase()),
    ).slice(0, 5);

    setSearchResults(localMatches);
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const liveQuotes: SearchQuote[] = await searchStocks(query);
        const apiMatches: StockInfo[] = liveQuotes.map((q) => ({
          ticker: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          sector: q.sector || q.quoteType || "Equity",
        }));

        // Merge local matches with API matches, removing duplicates
        const merged = [...localMatches];
        for (const apiItem of apiMatches) {
          if (!merged.some((m) => m.ticker === apiItem.ticker)) {
            merged.push(apiItem);
          }
        }
        setSearchResults(merged);
      } catch (err) {
        // Silently fails back to local array
        console.warn("Live search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Highlight index is reset in onChange or when dropdown opens

  const handleSelect = (ticker: string) => {
    setInputValue(displayTicker(ticker));
    setIsOpen(false);
    onSelect(ticker); // Pass FULL ticker (with .BK etc.) to parent for API
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleSelect(searchResults[highlightedIndex].ticker);
        } else if (inputValue.trim()) {
          handleSelect(inputValue.trim().toUpperCase());
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    } else if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const raw = inputValue.trim().toUpperCase();
      // If user typed a short name like 'SCB', try to find and use the full ticker
      const match = POPULAR_STOCKS.find(
        (s) => displayTicker(s.ticker).toUpperCase() === raw,
      );
      handleSelect(match ? match.ticker : raw);
    }
  };

  const defaultLabel =
    locale === "th"
      ? "ค้นหาหุ้น (คลิกเลือกหรือพิมพ์ Ticker แล้วกด Enter)"
      : "Search Stock (Select or type Ticker & Enter)";
  const placeholderText = "e.g. AAPL, VOO, PTT, KBANK, GC (ทองคำ)";

  const showLoader = isLoading || isSearching;

  return (
    <div className={styles.container} ref={dropdownRef}>
      <label htmlFor={id} className={styles.label}>
        {label || defaultLabel}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={id}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className={`${styles.input} ${showLoader ? styles.loadingInput : ""}`}
          autoComplete="off"
          disabled={isLoading}
        />

        {showLoader && <div className={styles.spinner}></div>}

        {isOpen && searchResults.length > 0 && (
          <ul className={styles.dropdown}>
            {searchResults.map((s, index) => (
              <li
                key={s.ticker}
                className={`${styles.dropdownItem} ${
                  index === highlightedIndex ? styles.highlighted : ""
                }`}
                onClick={() => handleSelect(s.ticker)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className={styles.tickerName}>
                  {displayTicker(s.ticker)}
                </div>
                <div className={styles.companyName}>
                  {s.name} <span className={styles.sector}>({s.sector})</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
