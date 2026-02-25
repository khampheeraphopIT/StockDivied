import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Locale, TranslationKeys } from "./types";
import { th } from "./th";
import { en } from "./en";

const translations: Record<Locale, TranslationKeys> = { th, en };

function detectLocale(): Locale {
  const saved = localStorage.getItem("stockdived-locale") as Locale | null;
  if (saved && translations[saved]) return saved;

  const browserLang = navigator.language || "";
  if (browserLang.startsWith("th")) return "th";
  return "en";
}

interface I18nContextType {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("stockdived-locale", l);
    document.documentElement.lang = l;
  };

  const toggleLocale = () => {
    setLocale(locale === "th" ? "en" : "th");
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{ locale, t: translations[locale], setLocale, toggleLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
