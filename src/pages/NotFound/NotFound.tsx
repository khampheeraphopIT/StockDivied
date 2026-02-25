import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/Button/Button";
import "./NotFound.css";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="not-found page-container">
      <div className="not-found-content animate-fade-in">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">{t.common.pageNotFound}</h1>
        <p className="not-found-desc">{t.common.pageNotFoundDesc}</p>
        <Link to="/">
          <Button variant="primary">{t.common.backToHome}</Button>
        </Link>
      </div>
    </div>
  );
}
