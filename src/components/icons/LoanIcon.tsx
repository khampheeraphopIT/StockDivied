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

export function LoanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...d} {...props}>
      <path d="M3 21h18" />
      <path d="M3 7v1a3 3 0 0 0 6 0V7" />
      <path d="M9 7v1a3 3 0 0 0 6 0V7" />
      <path d="M15 7v1a3 3 0 0 0 6 0V7" />
      <path d="M6 21V11" />
      <path d="M12 21V11" />
      <path d="M18 21V11" />
      <path d="M2 7h20" />
      <path d="M12 3L2 7h20L12 3z" />
    </svg>
  );
}
