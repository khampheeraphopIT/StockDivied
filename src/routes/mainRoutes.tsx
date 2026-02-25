import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/Home/Home";
import { DividendCalculatorPage } from "@/pages/DividendCalculator/DividendCalculator";
import { CompoundInterestPage } from "@/pages/CompoundInterest/CompoundInterest";
import { PERatioPage } from "@/pages/PERatio/PERatio";
import { CAGRPage } from "@/pages/CAGR/CAGR";
import { PositionSizePage } from "@/pages/PositionSize/PositionSize";
import { ProfitLossPage } from "@/pages/ProfitLoss/ProfitLoss";
import { DCASimulatorPage } from "@/pages/DCASimulator/DCASimulator";
import { LoanCalculatorPage } from "@/pages/LoanCalculator/LoanCalculator";
import { BreakEvenPage } from "@/pages/BreakEven/BreakEven";
import { InvestmentComparisonPage } from "@/pages/InvestmentComparison/InvestmentComparison";
import { GuidePage } from "@/pages/Guide/Guide";
import { NotFoundPage } from "@/pages/NotFound/NotFound";
import { PrivacyPolicyPage } from "@/pages/Legal/PrivacyPolicy";
import { TermsOfServicePage } from "@/pages/Legal/TermsOfService";
import { DisclaimerPage } from "@/pages/Legal/Disclaimer";

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dividend-calculator", element: <DividendCalculatorPage /> },
      { path: "compound-interest", element: <CompoundInterestPage /> },
      { path: "pe-ratio", element: <PERatioPage /> },
      { path: "cagr", element: <CAGRPage /> },
      { path: "position-size", element: <PositionSizePage /> },
      { path: "profit-loss", element: <ProfitLossPage /> },
      { path: "dca-simulator", element: <DCASimulatorPage /> },
      { path: "loan-calculator", element: <LoanCalculatorPage /> },
      { path: "break-even", element: <BreakEvenPage /> },
      { path: "investment-comparison", element: <InvestmentComparisonPage /> },
      { path: "guide", element: <GuidePage /> },
      { path: "privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "terms-of-service", element: <TermsOfServicePage /> },
      { path: "disclaimer", element: <DisclaimerPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routes);
}
