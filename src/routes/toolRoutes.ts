import type { ComponentType, SVGProps } from "react";
import { DividendIcon } from "@/components/icons/DividendIcon";
import { CompoundIcon } from "@/components/icons/CompoundIcon";
import { PERatioIcon } from "@/components/icons/PERatioIcon";
import { CAGRIcon } from "@/components/icons/CAGRIcon";
import { PositionSizeIcon } from "@/components/icons/PositionSizeIcon";
import { ProfitLossIcon } from "@/components/icons/ProfitLossIcon";
import { DCAIcon } from "@/components/icons/DCAIcon";
import { LoanIcon } from "@/components/icons/LoanIcon";
import { BreakEvenIcon } from "@/components/icons/BreakEvenIcon";
import { CompareIcon } from "@/components/icons/CompareIcon";

export interface ToolRoute {
  id: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  category: "stock" | "growth" | "risk" | "business";
}

export const TOOL_ROUTES: ToolRoute[] = [
  {
    id: "dividendCalc",
    path: "/dividend-calculator",
    icon: DividendIcon,
    color: "#10b981",
    category: "stock",
  },
  {
    id: "compoundInterest",
    path: "/compound-interest",
    icon: CompoundIcon,
    color: "#6366f1",
    category: "growth",
  },
  {
    id: "peRatio",
    path: "/pe-ratio",
    icon: PERatioIcon,
    color: "#f59e0b",
    category: "stock",
  },
  {
    id: "cagr",
    path: "/cagr",
    icon: CAGRIcon,
    color: "#ec4899",
    category: "growth",
  },
  {
    id: "positionSize",
    path: "/position-size",
    icon: PositionSizeIcon,
    color: "#14b8a6",
    category: "risk",
  },
  {
    id: "profitLoss",
    path: "/profit-loss",
    icon: ProfitLossIcon,
    color: "#8b5cf6",
    category: "stock",
  },
  {
    id: "dcaSimulator",
    path: "/dca-simulator",
    icon: DCAIcon,
    color: "#06b6d4",
    category: "growth",
  },
  {
    id: "loanCalc",
    path: "/loan-calculator",
    icon: LoanIcon,
    color: "#f97316",
    category: "business",
  },
  {
    id: "breakEven",
    path: "/break-even",
    icon: BreakEvenIcon,
    color: "#84cc16",
    category: "business",
  },
  {
    id: "investmentCompare",
    path: "/investment-comparison",
    icon: CompareIcon,
    color: "#e11d48",
    category: "growth",
  },
];
