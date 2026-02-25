import { useI18n } from "@/i18n";
import { Card } from "@/components/ui/Card/Card";
import { FormulaIcon } from "@/components/icons/FormulaIcon";
import { LightbulbIcon } from "@/components/icons/LightbulbIcon";
import { TOOL_ROUTES } from "@/routes/toolRoutes";
import styles from "./Guide.module.css";

export function GuidePage() {
  const { t, locale } = useI18n();

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{t.guide.title}</h1>
      <p className="page-description">{t.guide.subtitle}</p>

      <div className={styles.guideSections}>
        {t.guide.sections.map((section, index) => {
          const toolRoute = TOOL_ROUTES[index];
          const Icon = toolRoute?.icon;

          return (
            <Card key={section.id} className={styles.guideCard}>
              <div className={styles.guideCardHeader}>
                {Icon && (
                  <span
                    className={styles.guideCardIcon}
                    style={{
                      background: `${toolRoute.color}20`,
                      color: toolRoute.color,
                    }}
                  >
                    <Icon width={22} height={22} />
                  </span>
                )}
                <h2 className={styles.guideCardTitle}>{section.title}</h2>
              </div>
              <p className={styles.guideCardContent}>{section.content}</p>
              {section.formula && (
                <div className={styles.guideFormula}>
                  <span className={styles.guideFormulaLabel}>
                    <FormulaIcon width={14} height={14} />
                    {locale === "th" ? "สูตร" : "Formula"}
                  </span>
                  <code className={styles.guideFormulaCode}>
                    {section.formula}
                  </code>
                </div>
              )}
              {section.tip && (
                <div className={styles.guideTip}>
                  <LightbulbIcon
                    width={18}
                    height={18}
                    className={styles.guideTipIcon}
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
