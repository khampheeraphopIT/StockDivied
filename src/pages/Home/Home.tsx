import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { TOOL_ROUTES } from "@/routes/toolRoutes";
import type { TranslationKeys } from "@/i18n/types";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";
import { LiveChartPage } from "@/pages/LiveChart/LiveChart";
import styles from "./Home.module.css";

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
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`${styles.heroContent} animate-fade-in`}>
          <h1 className={styles.heroTitle}>{t.home.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.home.heroSubtitle}</p>
          <Button size="lg" onClick={() => navigate(TOOL_ROUTES[0].path)}>
            {t.home.getStarted}
          </Button>
        </div>
      </section>

      <section className="page-container" style={{ paddingBottom: 0 }}>
        <AdBanner layout="horizontal" />
      </section>

      {/* Hero Live Chart for massive value */}
      <section
        className="page-container"
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <h2
          className="page-title"
          style={{
            textAlign: "left",
            marginBottom: "1rem",
            fontSize: "1.5rem",
          }}
        >
          {locale === "th"
            ? "ตลาดหุ้นตอนนี้ (Real-Time)"
            : "Live Market Overview"}
        </h2>
        <LiveChartPage isEmbedded={true} />
      </section>

      {/* Tools Grid */}
      <section className={`${styles.toolsSection} page-container`}>
        <h2 className="page-title">{t.home.toolsTitle}</h2>
        <p className="page-description">{t.home.toolsSubtitle}</p>

        <div className={styles.toolsGrid}>
          {TOOL_ROUTES.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className={`${styles.toolCard} animate-fade-in animate-fade-in-delay-${(i % 3) + 1}`}
                onClick={() => navigate(tool.path)}
              >
                <div
                  className={styles.toolCardIcon}
                  style={{ background: `${tool.color}15`, color: tool.color }}
                >
                  <Icon width={28} height={28} />
                </div>
                <h3 className={styles.toolCardName}>
                  {getToolName(t, tool.id)}
                </h3>
                <p className={styles.toolCardDesc}>{getToolDesc(t, tool.id)}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Beginner Section */}
      <section className={`${styles.beginnerSection} page-container`}>
        <Card className={styles.beginnerCard} glow>
          <h2 className={styles.beginnerTitle}>{t.home.beginnerTitle}</h2>
          <p className={styles.beginnerDesc}>{t.home.beginnerDesc}</p>
        </Card>
      </section>
    </div>
  );
}
