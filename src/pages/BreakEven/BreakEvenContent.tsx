import { SEOArticle } from "@/components/ui/SEOArticle/SEOArticle";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";

export function BreakEvenContent() {
  return (
    <SEOArticle title="Break-Even Point (จุดคุ้มทุน): หัวใจของการเริ่มต้นธุรกิจ">
      <p>
        <strong>จุดคุ้มทุน (Break-Even Point - BEP)</strong>{" "}
        คือจุดทศนิยมหรือระดับของยอดขาย (Sales Volume) ที่ทำให้{" "}
        <em>
          รายได้รวม (Total Revenue) เท่ากับ ต้นทุนรวม (Total Cost) พอดีเป๊ะ
        </em>{" "}
        หรือพูดภาษาชาวบ้านคือ "ยอดขายที่ไม่ขาดทุนและไม่กำไร"
      </p>

      <AdBanner layout="horizontal" />

      <h3>ทำไมคนทำธุรกิจต้องรู้จักจุดคุ้มทุน?</h3>
      <p>
        เจ้าของกิจการหรือ Startup ที่เจ๊งส่วนใหญ่ มีปัญหาเหมือนกันข้อหนึ่งคือ{" "}
        <em>"ไม่รู้ว่าต้องขายของกี่ชิ้นถึงจะรอดในแต่ละเดือน"</em> การคำนวณหา
        Break-Even Point ถือเป็นก้าวแรกของการทำ Business Plan เสมอ
      </p>
      <ul>
        <li>
          <strong>ตั้งเป้ายอดขายได้ชัดเจน (Setting Targets):</strong>{" "}
          ทีมเซลล์จะรู้ว่ายอด KPI ขั้นต่ำที่ต้องทำให้ได้ในเดือนนี้คือเท่าไหร่
        </li>
        <li>
          <strong>ช่วยตั้งประเมินราคาสินค้า (Pricing Strategy):</strong>{" "}
          ถ้าหาจุดคุ้มทุนแล้วพบว่าต้องขายเป็นแสนชิ้น
          (ซึ่งเป็นไปไม่ได้ในความเป็นจริง) คุณจะรู้ทันทีว่าต้อง{" "}
          <em>ขึ้นราคาสินค้า</em> หรือหาทาง <em>ลดต้นทุน</em> ก่อนเริ่มทำธุรกิจ
        </li>
        <li>
          <strong>ความปลอดภัยทางการเงิน (Margin of Safety):</strong>{" "}
          ถ้ายอดขายปัจจุบันของคุณทิ้งห่างจากจุดตุ้มทุนมากเท่าไหร่
          ธุรกิจคุณยิ่งมีความปลอดภัย (Safe Zone) มากขึ้นเท่านั้น
          แม้เศรษฐกิจจะแย่ลง คุณก็ยังมีสายป่านที่ทนแรงกระแทกได้
        </li>
      </ul>

      <h3>โครงสร้างของสมการ Break-Even</h3>
      <p>
        ตัวแปรสำคัญที่ใช้คำนวณคือการแยก{" "}
        <strong>"ต้นทุนคงที่" (Fixed Costs)</strong> กับ{" "}
        <strong>"ต้นทุนผันแปร" (Variable Costs)</strong> ออกจากกันให้เด็ดขาด
      </p>
      <ul>
        <li>
          <em>Fixed Costs:</em> ค่าเช่าที่, เงินเดือนพนักงานประจำ,
          ค่าเซิร์ฟเวอร์ (ต่อให้ขายไม่ได้สักชิ้นก็ต้องจ่าย)
        </li>
        <li>
          <em>Variable Costs:</em> ค่าวัตถุดิบ, ค่ากล่องพัสดุ, ค่าเปอร์เซ็นต์ GP
          (ขาย 1 ชิ้นก็เสียส่วนนี้ 1 ครั้ง ไม่ขายก็ไม่เสีย)
        </li>
      </ul>
      <p>
        <strong>
          สมการ: Break-Even Units = Fixed Costs / (Selling Price - Variable Cost
          per Unit)
        </strong>
      </p>
      <p>
        *ส่วนต่างระหว่าง ราคาขาย กับ ต้นทุนผันแปร (Price - Variable Cost)
        ถูกเรียกว่า <strong>Contribution Margin (กำไรส่วนเกิน)</strong>{" "}
        ซึ่งจะถูกนำไปโปะเป็นค่า Fixed Costs นั่งเอง
      </p>

      <AdBanner layout="horizontal" />
    </SEOArticle>
  );
}
