import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { TOOL_ROUTES } from "@/routes/toolRoutes";
import type { TranslationKeys } from "@/i18n/types";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import "./Home.css";

function getToolName(t: TranslationKeys, toolId: string): string {
  const key = toolId as keyof TranslationKeys["tools"];
  const tool = t.tools[key];
  if (tool && "name" in tool) return tool.name;
  return toolId;
}

function getToolDesc(t: TranslationKeys, toolId: string): string {
  const key = toolId as keyof TranslationKeys["tools"];
  const tool = t.tools[key];
  if (tool && "desc" in tool) return tool.desc;
  return "";
}

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">{t.home.heroTitle}</h1>
          <p className="hero-subtitle">{t.home.heroSubtitle}</p>
          <Button size="lg" onClick={() => navigate(TOOL_ROUTES[0].path)}>
            {t.home.getStarted}
          </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="tools-section page-container">
        <h2 className="page-title">{t.home.toolsTitle}</h2>
        <p className="page-description">{t.home.toolsSubtitle}</p>

        <div className="tools-grid">
          {TOOL_ROUTES.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className={`tool-card animate-fade-in animate-fade-in-delay-${(i % 3) + 1}`}
                onClick={() => navigate(tool.path)}
              >
                <div
                  className="tool-card-icon"
                  style={{ background: `${tool.color}15`, color: tool.color }}
                >
                  <Icon width={28} height={28} />
                </div>
                <h3 className="tool-card-name">{getToolName(t, tool.id)}</h3>
                <p className="tool-card-desc">{getToolDesc(t, tool.id)}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Beginner Section */}
      <section className="beginner-section page-container">
        <Card className="beginner-card" glow>
          <h2 className="beginner-title">{t.home.beginnerTitle}</h2>
          <p className="beginner-desc">{t.home.beginnerDesc}</p>
        </Card>
      </section>
    </div>
  );
}
