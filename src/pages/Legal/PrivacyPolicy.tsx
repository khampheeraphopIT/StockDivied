import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";

export function PrivacyPolicyPage() {
  const { locale } = useI18n();

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 800 }}>
      {locale === "th" ? (
        <>
          <h1 className="page-title">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <p>
              ยินดีต้อนรับสู่ StockDivied!
              เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
              นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เรารวบรวมและใช้งานข้อมูลของคุณ
            </p>

            <h3>1. ข้อมูลที่เราจัดเก็บ</h3>
            <p>
              เรา <strong>ไม่ได้</strong> จัดเก็บข้อมูลส่วนบุคคลใดๆ ของคุณ (เช่น
              ชื่อ อีเมล รหัสผ่าน)
              เนื่องจากเครื่องมือของเราทำงานบนเบราว์เซอร์ของคุณโดยไม่มีฐานข้อมูลผู้ใช้
              นอกจากนี้
              ข้อมูลพอร์ตหุ้นและตัวเลขที่คุณกรอกในเครื่องคิดเลขจะไม่ถูกส่งกลับมายังเซิร์ฟเวอร์ของเรา
            </p>

            <h3>2. คุกกี้และโฆษณา (Cookies & Advertising)</h3>
            <p>
              เว็บไซต์ของเราอาจมีการใช้คุกกี้เพื่อให้บริการและแสดงโฆษณาที่เกี่ยวข้อง
              (เช่น Google AdSense)
              ผู้ให้บริการบุคคลที่สามอาจอ่านและตั้งค่าคุกกี้บนเบราว์เซอร์ของคุณ
              หรือติดตามพฤติกรรมบนเว็บไซต์อื่นๆ
              เพื่อนำเสนอโฆษณาที่ตรงกัลความสนใจของคุณ
            </p>

            <h3>3. บริการดึงข้อมูลหุ้น (Third-Party Services)</h3>
            <p>
              เมื่อคุณใช้ฟีเจอร์ "ดึงข้อมูลหุ้นจริง"
              ระบบของเราจะทำการดึงข้อมูลจาก Yahoo Finance API โดยข้อมูล Ticker
              ที่คุณค้นหาอาจถูกรับรู้โดยผู้ให้บริการ API นั้นๆ (Yahoo Finance
              และ Proxy Provider) แต่ไม่สามารถเชื่อมโยงกลับมาถึงตัวตนของคุณได้
            </p>

            <h3>4. การยินยอม (Consent)</h3>
            <p>
              การใช้เว็บไซต์นี้ถือว่าคุณยอมรับนโยบายความเป็นส่วนตัวของเรา
              รวมถึงนโยบายการใช้คุกกี้ หากคุณไม่ยินยอม โปรดหยุดใช้งานเว็บไซต์นี้
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="page-title">Privacy Policy</h1>
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <p>
              Welcome to StockDivied! We highly value your privacy. This Privacy
              Policy outlines how your data is treated when using our
              calculators.
            </p>

            <h3>1. Data We Collect</h3>
            <p>
              We <strong>do not</strong> collect any personally identifiable
              information (such as your name, email, or passwords) as this is a
              client-side application. The portfolio numbers and calculator
              inputs you enter remain on your browser and are not transmitted to
              our servers.
            </p>

            <h3>2. Cookies and Advertising</h3>
            <p>
              This site may use cookies to provide services and to serve
              relevant ads (such as via Google AdSense). Third-party vendors may
              set and read cookies on your browser, or use web beacons to
              collect information as a result of ad serving on this website.
            </p>

            <h3>3. Third-Party Stock Data APIs</h3>
            <p>
              When you use the "Fetch Real Stock History" feature, a request is
              made to Yahoo Finance API endpoints. The ticker symbols you search
              for may be visible to these third-party operators, but this data
              cannot be tied to your personal identity.
            </p>

            <h3>4. Consent</h3>
            <p>
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms. If you do not agree, please discontinue using
              our site.
            </p>
          </div>
        </>
      )}
      <div
        style={{
          marginTop: "3rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "1.5rem",
        }}
      >
        <Link
          to="/terms-of-service"
          style={{ color: "#06b6d4", textDecoration: "none" }}
        >
          &rarr;{" "}
          {locale === "th"
            ? "อ่านข้อตกลงการใช้งาน (Terms of Service)"
            : "Read Terms of Service"}
        </Link>
      </div>
    </div>
  );
}
