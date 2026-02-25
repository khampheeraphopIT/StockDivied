import { useI18n } from "@/i18n";
import "./Footer.css";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-rights">{t.footer.rights}</p>
        <p className="footer-disclaimer">{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
