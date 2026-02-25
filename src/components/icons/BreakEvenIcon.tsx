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

export function BreakEvenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...d} {...props}>
      <path d="M12 3v18" />
      <path d="M5 7l7-4 7 4" />
      <path d="M5 7v2a5 5 0 0 0 3 0c1-.4 1.6-.4 2.5 0 .9.3 1.5.3 2.5 0a5 5 0 0 0 3 0V7" />
      <path d="M3 21h18" />
    </svg>
  );
}
