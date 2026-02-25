import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";
import { Sidebar } from "./Sidebar/Sidebar";
import { Footer } from "./Footer/Footer";
import { CookieConsent } from "../ui/CookieConsent/CookieConsent";
import { AdBanner } from "../ui/AdBanner/AdBanner";
import styles from "./Layout.module.css";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={styles.layout}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {!isHome && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <main
        className={`${styles.layoutContent} ${!isHome ? styles.layoutContentWithSidebar : ""}`}
      >
        <Outlet />
        <AdBanner />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
