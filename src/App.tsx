import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import { AppRoutes } from "@/routes/mainRoutes";

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </I18nProvider>
  );
}
