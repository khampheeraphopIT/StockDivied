import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Locale, Currency } from "./types";
import { th } from "./th";
import { en } from "./en";
import { I18nContext } from "./I18nContext";

const translations = { th, en } as const;

function detectLocale(): Locale {
  const saved = localStorage.getItem("stockdived-locale") as Locale | null;
  if (saved && translations[saved]) return saved;
  return "th";
}

function detectCurrency(): Currency {
  const saved = localStorage.getItem("stockdived-currency") as Currency | null;
  if (saved === "THB" || saved === "USD") return saved;
  return "THB";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const [currency, setCurrencyState] = useState<Currency>(detectCurrency);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("stockdived-locale", l);
    document.documentElement.lang = l;
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("stockdived-currency", c);
  };

  const toggleLocale = () => {
    setLocale(locale === "th" ? "en" : "th");
  };

  const toggleCurrency = () => {
    setCurrency(currency === "THB" ? "USD" : "THB");
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        currency,
        t: translations[locale],
        setLocale,
        toggleLocale,
        setCurrency,
        toggleCurrency,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
