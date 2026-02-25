import { createContext } from "react";
import type { Locale, TranslationKeys } from "./types";

export interface I18nContextType {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const I18nContext = createContext<I18nContextType | null>(null);
