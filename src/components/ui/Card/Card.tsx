import type { ReactNode } from "react";
import styles from "./Card.module.css";

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
      className={`${styles.card} ${glow ? styles.cardGlow : ""} ${onClick ? styles.cardClickable : ""} ${className}`}
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
