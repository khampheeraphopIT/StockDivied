import { useEffect } from "react";
import styles from "./AdBanner.module.css";
import { useI18n } from "@/i18n";

interface AdBannerProps {
  layout?: "horizontal" | "vertical" | "square";
  slotId?: string; // e.g., from Google AdSense
  client?: string; // Your publisher ID: ca-pub-XXXXXXXXXXXXXXXX
}

export function AdBanner({
  layout = "horizontal",
  slotId,
  client,
}: AdBannerProps) {
  const { locale } = useI18n();

  useEffect(() => {
    // If using Google AdSense, the script injects adsbygoogle
    // Once you have an approved AdSense account, uncomment this block:
    /*
    try {
      const gads = (window as any).adsbygoogle || [];
      gads.push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
    */
  }, []);

  const showRealAd = slotId && client;

  return (
    <div className={`${styles.adContainer} ${styles[layout]}`}>
      {showRealAd ? (
        // Real AdSense implementation
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        // Placeholder area to reserve space and show the user where ads will go
        <div className={styles.placeholder}>
          <span className={styles.badge}>Ad</span>
          <p className={styles.title}>
            {locale === "th" ? "พื้นที่โฆษณา" : "Advertisement Placement"}
          </p>
          <p className={styles.subtext}>
            {locale === "th"
              ? "รอเชื่อมต่อกับ Google AdSense หรือผู้สนับสนุน"
              : "Waiting for AdSense connection or Sponsors"}
          </p>
        </div>
      )}
    </div>
  );
}
