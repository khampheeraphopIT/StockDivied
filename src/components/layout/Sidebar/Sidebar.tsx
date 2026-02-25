import { NavLink } from "react-router-dom";
import { useI18n } from "@/i18n";
import { TOOL_ROUTES } from "@/routes/toolRoutes";
import type { TranslationKeys } from "@/i18n/types";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function getToolName(t: TranslationKeys, toolId: string): string {
  const key = toolId as keyof TranslationKeys["tools"];
  const tool = t.tools[key];
  if (tool && "name" in tool) return tool.name;
  return toolId;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useI18n();

  return (
    <>
      {isOpen && <div className={styles.sidebarOverlay} onClick={onClose} />}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>{t.nav.tools}</span>
        </div>

        <nav className={styles.sidebarNav}>
          {TOOL_ROUTES.map((tool) => {
            const Icon = tool.icon;
            return (
              <NavLink
                key={tool.id}
                to={tool.path}
                className={({ isActive }) =>
                  `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
                }
                onClick={onClose}
              >
                <span
                  className={styles.sidebarIcon}
                  style={{ background: `${tool.color}20`, color: tool.color }}
                >
                  <Icon width={18} height={18} />
                </span>
                <span className={styles.sidebarLinkText}>
                  {getToolName(t, tool.id)}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
