import { createContext } from "react";
import type { Locale, TranslationKeys, Currency } from "./types";

export interface I18nContextType {
  locale: Locale;
  currency: Currency;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
}

export const I18nContext = createContext<I18nContextType | null>(null);
