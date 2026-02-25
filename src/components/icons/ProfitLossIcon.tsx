import type { SVGProps } from "react";

const d: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ProfitLossIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...d} {...props}>
      <path d="M8 3v3" />
      <path d="M16 3v3" />
      <path d="M8 18v3" />
      <path d="M16 18v3" />
      <rect x="5" y="6" width="6" height="12" rx="1" />
      <rect x="13" y="6" width="6" height="8" rx="1" />
    </svg>
  );
}
