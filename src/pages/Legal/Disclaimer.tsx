import { useI18n } from "@/i18n";

export function DisclaimerPage() {
  const { locale } = useI18n();

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 800 }}>
      {locale === "th" ? (
        <>
          <h1 className="page-title">ข้อสงวนสิทธิ์ (Disclaimer)</h1>
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <p>
              <strong>StockDivied</strong>{" "}
              เป็นเพียงเครื่องมืออำนวยความสะดวกในการคำนวณและจำลองผลตอบแทนทางการเงินเบื้องต้น
              ข้อมูลทั้งหมดบนเว็บไซต์นี้ไม่มีวัตถุประสงค์เพื่อให้คำแนะนำการลงทุนชี้ชวนให้ซื้อขาย
              หรือรับประกันผลตอบแทนในอนาคต
            </p>
            <p>
              ผู้พัฒนาเว็บไซต์ไม่รับผิดชอบต่อความเสียหาย การขาดทุน
              หรือผลกระทบใดๆ ที่เกิดขึ้นจากการนำข้อมูล ผลลัพธ์จากการคำนวณ
              หรือการจำลองต่างๆ บนเว็บไซต์นี้ไปใช้ในการตัดสินใจลงทุนจริง
            </p>
            <p>
              <strong>
                การลงทุนมีความเสี่ยง
                ผู้ลงทุนควรศึกษาข้อมูลให้รอบคอบก่อนตัดสินใจลงทุน
              </strong>
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="page-title">Financial Disclaimer</h1>
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <p>
              <strong>StockDivied</strong> is provided solely as an
              informational tool for calculating and simulating potential
              financial returns. All data and information on this website are
              not intended to provide investment advice, solicit the buying or
              selling of securities, or guarantee any future returns.
            </p>
            <p>
              The developer of this website accepts no liability for any losses,
              damages, or consequences arising from the use of data, calculation
              results, or simulations provided on this site for real-world
              investment decisions.
            </p>
            <p>
              <strong>
                Investing involves risk. Investors should carefully consider
                their risk tolerance and conduct thorough research before making
                any investment decisions.
              </strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
