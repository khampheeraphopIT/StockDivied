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

export function DividendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...d} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5" />
      <path d="M9 15h6" />
      <path d="M12 17v-2" />
      <path d="M9.5 10.5L12 8l2.5 2.5" />
    </svg>
  );
}
