import { NavLink } from "react-router-dom";
import { useI18n } from "@/i18n";
import { TOOL_ROUTES } from "@/routes/toolRoutes";
import type { TranslationKeys } from "@/i18n/types";
import "./Sidebar.css";

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
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">{t.nav.tools}</span>
        </div>

        <nav className="sidebar-nav">
          {TOOL_ROUTES.map((tool) => {
            const Icon = tool.icon;
            return (
              <NavLink
                key={tool.id}
                to={tool.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                }
                onClick={onClose}
              >
                <span
                  className="sidebar-icon"
                  style={{ background: `${tool.color}20`, color: tool.color }}
                >
                  <Icon width={18} height={18} />
                </span>
                <span className="sidebar-link-text">
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
