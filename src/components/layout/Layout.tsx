import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";
import { Sidebar } from "./Sidebar/Sidebar";
import { Footer } from "./Footer/Footer";
import "./Layout.css";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`layout ${isHome ? "layout-home" : "layout-tool"}`}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {!isHome && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <main
        className={`layout-content ${isHome ? "" : "layout-content-with-sidebar"}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
