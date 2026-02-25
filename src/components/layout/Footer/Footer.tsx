import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLinks}>
          <Link to="/privacy-policy" className={styles.link}>
            Privacy Policy
          </Link>
          <span className={styles.dot}>•</span>
          <Link to="/terms-of-service" className={styles.link}>
            Terms of Service
          </Link>
          <span className={styles.dot}>•</span>
          <Link to="/disclaimer" className={styles.link}>
            Disclaimer
          </Link>
        </div>
        <p className={styles.footerRights}>{t.footer.rights}</p>
        <p className={styles.footerDisclaimer}>{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
