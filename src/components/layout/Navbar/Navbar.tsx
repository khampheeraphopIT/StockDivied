import { useI18n } from "@/i18n";
import { BrandIcon } from "@/components/icons/BrandIcon";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { t, locale, setLocale, currency, setCurrency } = useI18n();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <div className={styles.navbarLeft}>
          {!isHome && (
            <button
              className={styles.navbarHamburger}
              onClick={onToggleSidebar}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
          <Link to="/" className={styles.navbarBrand}>
            <BrandIcon className={styles.navbarLogo} />
            <span className={styles.navbarName}>{t.appName}</span>
          </Link>
        </div>

        <div className={styles.navbarRight}>
          {!isHome && (
            <Link to="/" className={styles.navbarLink}>
              {t.nav.home}
            </Link>
          )}
          <Link to="/" className={styles.navbarLink}>
            {t.nav.tools}
          </Link>
          <Link to="/guide" className={styles.navbarLink}>
            {t.nav.guide}
          </Link>

          <div className={styles.langSwitch} aria-label="Currency Toggle">
            <button
              className={`${styles.langBtn} ${currency === "THB" ? styles.langBtnActive : ""}`}
              onClick={() => setCurrency("THB")}
            >
              THB
            </button>
            <button
              className={`${styles.langBtn} ${currency === "USD" ? styles.langBtnActive : ""}`}
              onClick={() => setCurrency("USD")}
            >
              USD
            </button>
          </div>

          <div className={styles.langSwitch} aria-label={t.common.language}>
            <button
              className={`${styles.langBtn} ${locale === "th" ? styles.langBtnActive : ""}`}
              onClick={() => setLocale("th")}
            >
              TH
            </button>
            <button
              className={`${styles.langBtn} ${locale === "en" ? styles.langBtnActive : ""}`}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
          </div>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            {t.nav.home}
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            {t.nav.tools}
          </Link>
          <Link to="/guide" onClick={() => setMenuOpen(false)}>
            {t.nav.guide}
          </Link>
          <div className={styles.langSwitch}>
            <button
              className={`${styles.langBtn} ${currency === "THB" ? styles.langBtnActive : ""}`}
              onClick={() => {
                setCurrency("THB");
                setMenuOpen(false);
              }}
            >
              THB
            </button>
            <button
              className={`${styles.langBtn} ${currency === "USD" ? styles.langBtnActive : ""}`}
              onClick={() => {
                setCurrency("USD");
                setMenuOpen(false);
              }}
            >
              USD
            </button>
          </div>
          <div className={styles.langSwitch}>
            <button
              className={`${styles.langBtn} ${locale === "th" ? styles.langBtnActive : ""}`}
              onClick={() => {
                setLocale("th");
                setMenuOpen(false);
              }}
            >
              TH
            </button>
            <button
              className={`${styles.langBtn} ${locale === "en" ? styles.langBtnActive : ""}`}
              onClick={() => {
                setLocale("en");
                setMenuOpen(false);
              }}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
