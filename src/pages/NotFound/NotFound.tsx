import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/Button/Button";
import styles from "./NotFound.module.css";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className={`${styles.notFound} page-container`}>
      <div className={`${styles.notFoundContent} animate-fade-in`}>
        <span className={styles.notFoundCode}>404</span>
        <h1 className={styles.notFoundTitle}>{t.common.pageNotFound}</h1>
        <p className={styles.notFoundDesc}>{t.common.pageNotFoundDesc}</p>
        <Link to="/">
          <Button variant="primary">{t.common.backToHome}</Button>
        </Link>
      </div>
    </div>
  );
}
