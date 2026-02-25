import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";

export function TermsOfServicePage() {
  const { locale } = useI18n();

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 800 }}>
      {locale === "th" ? (
        <>
          <h1 className="page-title">
            ข้อตกลงและเงื่อนไขการใช้งาน (Terms of Service)
          </h1>
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <p>
              โปรดอ่านข้อตกลงและเงื่อนไขการให้บริการ ("Terms", "Terms of
              Service") อย่างละเอียดก่อนใช้งานเว็บไซต์ StockDivied ("เรา",
              "พวกเรา", หรือ "เว็บไซต์ของเรา")
            </p>

            <h3>1. การยอมรับข้อตกลง</h3>
            <p>
              โดยการเข้าถึงหรือใช้งานเครื่องมือบนเว็บไซต์นี้
              ถือว่าคุณยอมรับว่าคุณถูกผูกมัดตามข้อตกลงเหล่านี้
              หากคุณไม่เห็นด้วยกับส่วนใดส่วนหนึ่งของข้อตกลงนี้
              คุณไม่สามารถเข้าถึงหรือใช้บริการของเราได้
            </p>

            <h3>2. การใช้เครื่องมือและผลลัพธ์ (Disclaimer)</h3>
            <p>
              เครื่องมือ ซิมูเลเตอร์
              และผลลัพธ์จากเครื่องคิดเลขที่เราจัดเตรียมไว้ให้ ถือเป็น
              "ข้อมูลเบื้องต้นเพื่อการศึกษาเท่านั้น"
              ข้อมูลอ้างอิงจากราคาหุ้นในอดีต (Historical Data){" "}
              <strong>ไม่ใช่</strong>สิ่งยืนยันว่าผลตอบแทนในอนาคตจะเหมือนเดิม
              เราจะไม่รับผิดชอบทางการเงินหรือความเสียหายใดๆ
              ก็ตามที่เกิดขึ้นจากการใช้ผลลัพธ์ในเว็บของเราไปลงทุนในตลาดจริง
            </p>

            <h3>3. ทรัพย์สินทางปัญญา</h3>
            <p>
              เว็บไซต์ การออกแบบ กราฟิก และซอร์สโค้ดต้นฉบับ
              เป็นทรัพย์สินทางปัญญาของ StockDivied ไม่อนุญาตให้ทำการดัดแปลง
              ลอกเลียนแบบ หรือขายบริการซ้ำโดยไม่ได้รับอนุญาต
            </p>

            <h3>4. การเปลี่ยนแปลงแก้ไขข้อตกลง</h3>
            <p>
              เราขอสงวนสิทธิ์ในการแก้ไขหรือเพิ่มเติมข้อตกลงต่างๆ
              เหล่านี้ได้ทุกเมื่อโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="page-title">Terms of Service</h1>
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service")
              carefully before using the StockDivied website (the "Service")
              operated by us.
            </p>

            <h3>1. Agreement to Terms</h3>
            <p>
              By accessing or using the Service you agree to be bound by these
              Terms. If you disagree with any part of the terms then you may not
              access the Service.
            </p>

            <h3>2. Calculators and Disclaimer</h3>
            <p>
              The calculators, simulators, and all resulting data provided on
              this platform are strictly for{" "}
              <strong>educational and informational purposes only</strong>.
              Historical data fetchers do not guarantee future performance. We
              hold absolutely no liability for any financial losses or damages
              incurred by using our tools for your personal investment choices.
            </p>

            <h3>3. Intellectual Property</h3>
            <p>
              The original styling, interface, branding, and features are the
              intellectual property of StockDivied. You may not reproduce,
              duplicate, or resell the calculators without permission.
            </p>

            <h3>4. Changes</h3>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time without prior notice.
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
          to="/disclaimer"
          style={{
            color: "#06b6d4",
            textDecoration: "none",
            marginRight: "1rem",
          }}
        >
          &rarr;{" "}
          {locale === "th"
            ? "อ่านข้อสงวนสิทธิ์ทางการเงิน (Disclaimer)"
            : "Read Financial Disclaimer"}
        </Link>
      </div>
    </div>
  );
}
