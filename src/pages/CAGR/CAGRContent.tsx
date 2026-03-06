import { SEOArticle } from "@/components/ui/SEOArticle/SEOArticle";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";

export function CAGRContent() {
  return (
    <SEOArticle title="CAGR (Compound Annual Growth Rate) คืออะไร? สุดยอดมาตรวัดการเติบโต">
      <p>
        <strong>CAGR หรือ อัตราการเติบโตเฉลี่ยแบบทบต้น</strong>{" "}
        เป็นหนึ่งในตัวเลขที่นักวิเคราะห์การเงิน (Financial Analyst)
        และผู้จัดการกองทุน (Fund Manager) ให้ความสำคัญมากที่สุดในการประเมินผลงาน
        (Performance) ของพอร์ตการลงทุน หรือการเติบโตของบริษัท (เช่น รายได้ หรือ
        กำไรสุทธิ) ตลอดช่วงระยะเวลาหลายๆ ปี
      </p>

      <AdBanner layout="horizontal" />

      <h3>ทำไมต้องใช้ CAGR แทนค่าเฉลี่ยธรรมดา (Simple Average)?</h3>
      <p>
        เหตุผลที่โลกการเงินต้องสร้างสมการ CAGR ขึ้นมา
        ก็เพราะการแกว่งตัวของเปอร์เซ็นต์ (Volatility Drag) หลอกตาเราได้
        ตัวอย่างเช่น:
      </p>
      <ul>
        <li>
          ปีที่ 1: พอร์ตคุณได้กำไร <strong>+100%</strong> (จาก 100 บาท กลายเป็น
          200 บาท)
        </li>
        <li>
          ปีที่ 2: พอร์ตคุณขาดทุน <strong>-50%</strong> (จาก 200 บาท กลับมาเหลือ
          100 บาท เท่าเดิม!)
        </li>
      </ul>
      <p>
        ถ้าคุณหาค่าเฉลี่ยธรรมดา: (100% - 50%) / 2 = <strong>+25% ต่อปี</strong>{" "}
        ฟังดูดีมากใช่ไหม? เหมือนคุณได้กำไรปีละ 25% แต่ความจริงคือ
        พอร์ตคุณไม่มีกำไรเลยแม้แต่บาทเดียว (มูลค่าเริ่มต้นและสิ้นสุดเท่ากันที่
        100 บาท)
      </p>
      <p>
        การคำนวณ <strong>CAGR จะบอกความจริงกับคุณ</strong> ในกรณีนี้ CAGR
        จะคำนวณได้เท่ากับ <strong>0%</strong>{" "}
        ซึ่งสะท้อนความเป็นจริงได้อย่างถูกต้องและยุติธรรมที่สุด
      </p>

      <AdBanner layout="horizontal" />

      <h3>การนำ CAGR ไปประยุกต์ใช้ในการประเมินมูลค่าหุ้น</h3>
      <p>
        บรรดาเซียนหุ้นพื้นฐาน ไม่ว่าจะเป็น <em>Ray Dalio</em> หรือ{" "}
        <em>Charlie Munger</em> มักใช้ CAGR เป็นหัวใจในการทำ Financial
        Projection หากบริษัท A มีกำไร(EPS) เติบโตด้วย CAGR ระดับ 20% ต่อเนื่อง 5
        ปี นั่นคือหุ้นทวีคูณ (Multibagger) ในทางกลับกัน หาก Revenue CAGR ติดลบ
        นั่นคือธุรกิจตะวันตกดิน (Sunset Industry)
      </p>

      <h3>วิธีใช้ CAGR Calculator</h3>
      <ol>
        <li>
          กรอกมูลค่าเริ่มต้น (Beginning Value) ของพอร์ต หรือ งบการเงินบริษัท
        </li>
        <li>กรอกมูลค่าปัจจุบันหรือสิ้นสุด (Ending Value)</li>
        <li>กรอกจำนวนปี (Number of Years)</li>
      </ol>
      <p>
        จำไว้เสมอว่า <em>อัตราผลตอบแทนระยะยาวระดับ 10-15% CAGR</em>{" "}
        ก็เพียงพอที่จะทำให้คุณกลายเป็นเศรษฐีได้ในชั่วอายุขัย (Lifetime)
        เพราะความมหัศจรรย์ของการทบต้น (Compounding Effect)
      </p>
    </SEOArticle>
  );
}
