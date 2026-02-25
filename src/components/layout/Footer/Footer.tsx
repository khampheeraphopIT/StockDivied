import { useI18n } from "@/i18n";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerRights}>{t.footer.rights}</p>
        <p className={styles.footerDisclaimer}>{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
