import { useI18n } from "@/i18n";
import { BrandIcon } from "@/components/icons/BrandIcon";
import "./Navbar.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { t, locale, setLocale } = useI18n();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button
            className="navbar-hamburger"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="navbar-brand">
            <BrandIcon className="navbar-logo" />
            <span className="navbar-name">{t.appName}</span>
          </Link>
        </div>

        <div className="navbar-right">
          {!isHome && (
            <Link to="/" className="navbar-link">
              {t.nav.home}
            </Link>
          )}
          <Link to="/" className="navbar-link">
            {t.nav.tools}
          </Link>
          <Link to="/guide" className="navbar-link">
            {t.nav.guide}
          </Link>

          <div className="lang-switch" aria-label={t.common.language}>
            <button
              className={`lang-btn ${locale === "th" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("th")}
            >
              TH
            </button>
            <button
              className={`lang-btn ${locale === "en" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            {t.nav.home}
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            {t.nav.tools}
          </Link>
          <Link to="/guide" onClick={() => setMenuOpen(false)}>
            {t.nav.guide}
          </Link>
          <div className="lang-switch">
            <button
              className={`lang-btn ${locale === "th" ? "lang-btn-active" : ""}`}
              onClick={() => {
                setLocale("th");
                setMenuOpen(false);
              }}
            >
              TH
            </button>
            <button
              className={`lang-btn ${locale === "en" ? "lang-btn-active" : ""}`}
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
