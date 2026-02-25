import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function Card({
  children,
  className = "",
  onClick,
  glow = false,
}: CardProps) {
  return (
    <div
      className={`card ${glow ? "card-glow" : ""} ${onClick ? "card-clickable" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter") onClick();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
