import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button/Button";
import { useI18n } from "@/i18n";
import styles from "./CookieConsent.module.css";

export function CookieConsent() {
  const { locale } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const title =
    locale === "th" ? "เว็บไซต์นี้ใช้คุกกี้ 🍪" : "We value your privacy 🍪";

  const text =
    locale === "th"
      ? "เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณและมอบโฆษณาที่เกี่ยวข้อง การคลิก 'ยอมรับ' แสดงว่าคุณยินยอมให้เราใช้คุกกี้ทั้งหมด"
      : "We use cookies to enhance your browsing experience and serve personalized ads. By clicking 'Accept All', you consent to our use of cookies.";

  const acceptBtn = locale === "th" ? "ยอมรับทั้งหมด" : "Accept All";
  const declineBtn = locale === "th" ? "ปฏิเสธ" : "Decline";

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.text}>{text}</p>
        </div>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={handleDecline}
            className={styles.button}
          >
            {declineBtn}
          </Button>
          <Button
            variant="primary"
            onClick={handleAccept}
            className={styles.button}
          >
            {acceptBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}
