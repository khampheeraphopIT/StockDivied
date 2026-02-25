import { useI18n } from "@/i18n";
import { Card } from "@/components/ui/Card/Card";
import { FormulaIcon } from "@/components/icons/FormulaIcon";
import { LightbulbIcon } from "@/components/icons/LightbulbIcon";
import { TOOL_ROUTES } from "@/routes/toolRoutes";
import "./Guide.css";

export function GuidePage() {
  const { t, locale } = useI18n();

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{t.guide.title}</h1>
      <p className="page-description">{t.guide.subtitle}</p>

      <div className="guide-sections">
        {t.guide.sections.map((section, index) => {
          const toolRoute = TOOL_ROUTES[index];
          const Icon = toolRoute?.icon;

          return (
            <Card key={section.id} className="guide-card">
              <div className="guide-card-header">
                {Icon && (
                  <span
                    className="guide-card-icon"
                    style={{
                      background: `${toolRoute.color}20`,
                      color: toolRoute.color,
                    }}
                  >
                    <Icon width={22} height={22} />
                  </span>
                )}
                <h2 className="guide-card-title">{section.title}</h2>
              </div>
              <p className="guide-card-content">{section.content}</p>
              {section.formula && (
                <div className="guide-formula">
                  <span className="guide-formula-label">
                    <FormulaIcon width={14} height={14} />
                    {locale === "th" ? "สูตร" : "Formula"}
                  </span>
                  <code className="guide-formula-code">{section.formula}</code>
                </div>
              )}
              {section.tip && (
                <div className="guide-tip">
                  <LightbulbIcon
                    width={18}
                    height={18}
                    className="guide-tip-icon"
                  />
                  <span>{section.tip}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
