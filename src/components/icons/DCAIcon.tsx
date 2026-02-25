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

export function DCAIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...d} {...props}>
      <path d="M21.5 2v6h-6" />
      <path d="M2.5 22v-6h6" />
      <path d="M2.5 11.5a10 10 0 0 1 18.8-4.3" />
      <path d="M21.5 12.5a10 10 0 0 1-18.8 4.2" />
    </svg>
  );
}
