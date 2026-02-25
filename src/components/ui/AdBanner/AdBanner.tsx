/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import styles from "./AdBanner.module.css";

interface AdBannerProps {
  layout?: "horizontal" | "vertical" | "square";
}

export function AdBanner({ layout = "horizontal" }: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const gads = (window as any).adsbygoogle || [];
      gads.push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or blocked by adblocker — fail silently
    }
  }, []);

  return (
    <div className={`${styles.adContainer} ${styles[layout]}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2397963589758902"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
