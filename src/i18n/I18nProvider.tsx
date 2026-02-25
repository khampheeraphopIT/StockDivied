import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Locale } from "./types";
import { th } from "./th";
import { en } from "./en";
import { I18nContext } from "./I18nContext";

const translations = { th, en } as const;

function detectLocale(): Locale {
  const saved = localStorage.getItem("stockdived-locale") as Locale | null;
  if (saved && translations[saved]) return saved;
  return "th";
}

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
