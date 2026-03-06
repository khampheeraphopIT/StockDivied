/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useId, useRef } from "react";
import { useI18n } from "@/i18n";
import { AdBanner } from "@/components/ui/AdBanner/AdBanner";
import { SEOArticle } from "@/components/ui/SEOArticle/SEOArticle";

interface LiveChartProps {
  isEmbedded?: boolean;
}

export function LiveChartPage({ isEmbedded = false }: LiveChartProps) {
  const { t, locale } = useI18n();
  const tt = t.tools.liveChart;

  const containerRef = useRef<HTMLDivElement>(null);

  const rawId = useId();
  const containerId = "tv_chart_" + rawId.replace(/:/g, "");

  useEffect(() => {
    let tvWidget: any = null;

    function renderWidget() {
      if (document.getElementById(containerId) && "TradingView" in window) {
        tvWidget = new (window as any).TradingView.widget({
          autosize: true,
          symbol: "SET:PTT",
          interval: "D",
          timezone: "Asia/Bangkok",
          theme: "dark",
          style: "1",
          locale: locale === "th" ? "th_TH" : "en",
          enable_publishing: false,
          backgroundColor: "rgba(18, 18, 18, 1)",
          gridColor: "rgba(255, 255, 255, 0.06)",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
          width: "100%",
          height: "100%",
        });
      }
    }

    if (!document.getElementById("tradingview-tv-js")) {
      const script = document.createElement("script");
      script.id = "tradingview-tv-js";
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      if ("TradingView" in window) {
        renderWidget();
      } else {
        document
          .getElementById("tradingview-tv-js")
          ?.addEventListener("load", renderWidget);
      }
    }

    return () => {
      if (tvWidget && typeof tvWidget.remove === "function") {
        tvWidget.remove();
      }
    };
  }, [locale, containerId]);

  return (
    <div
      className={
        isEmbedded ? "animate-fade-in" : "page-container animate-fade-in"
      }
    >
      {!isEmbedded && (
        <>
          <h1 className="page-title">{tt.name}</h1>
          <p className="page-description">{tt.desc}</p>
          <AdBanner />
        </>
      )}

      {/* Chart Container */}
      <div
        className="calculator-grid tradingview-widget-container"
        ref={containerRef}
        style={{
          height: isEmbedded ? "500px" : "600px",
          marginBottom: "2rem",
          padding: 0,
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
        }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "100%", width: "100%" }}
        ></div>
      </div>

      {!isEmbedded && (
        <SEOArticle
          title={
            locale === "th"
              ? "วิเคราะห์กราฟเทคนิคด้วยตัวเอง"
              : "Perform Your Own Technical Analysis"
          }
        >
          {locale === "th" ? (
            <>
              <p>
                กราฟหุ้นแบบ Real-Time ด้านบนถูกรันด้วยเครื่องมือระดับโลกจาก{" "}
                <strong>TradingView</strong>{" "}
                ที่ได้รับความนิยมสูงสุดจากเทรดเดอร์ทั่วโลก
                คุณสามารถค้นหาสัญลักษณ์ (Ticker/Symbol) ของหุ้นไทย
                (โดยพิมพ์นำหน้าว่า <code>SET:</code> เช่น <code>SET:AOT</code>),
                หุ้นอเมริกา (เช่น <code>AAPL</code>, <code>TSLA</code>),
                หรือแม้กระทั่งคริปโตเคอร์เรนซี (เช่น <code>BINANCE:BTCUSD</code>
                ) ได้เลย
              </p>
              <h3>ทำไมเทรดเดอร์ถึงต้องดูกราฟ?</h3>
              <p>
                การวิเคราะห์ทางเทคนิค (Technical Analysis) ช่วยให้คุณเห็น
                "พฤติกรรมมวลชน" ที่สะท้อนออกมาในรูปแบบของราคาและปริมาณการซื้อขาย
                (Volume) คุณสามารถใช้เครื่องมือด้านซ้ายมือ
                ไม่ว่าจะเป็นตีเส้นแนวรับ-แนวต้าน, วาด Fibonacci, หรือใส่
                Indicator (เช่น RSI, MACD, Moving Average)
                เพื่อหาจังหวะจุดเข้าซื้อ (Entry) และจุดตัดขาดทุน (Stop Loss)
                ที่แม่นยำที่สุด
              </p>
            </>
          ) : (
            <>
              <p>
                The real-time interactive chart above is powered by{" "}
                <strong>TradingView</strong>, the world's leading charting
                platform for traders. You can search for global US Stocks (like{" "}
                <code>AAPL</code>, <code>TSLA</code>), Forex, or Crypto (like{" "}
                <code>BINANCE:BTCUSD</code>) using the top search bar.
              </p>
              <h3>Why Charts Are Essential</h3>
              <p>
                Technical Analysis helps you identify market psychology encoded
                in purely price action and volume. You can utilize the toolbars
                to draw support/resistance lines, Fibonacci retracements, or
                apply indicators like RSI, MACD, and Moving Averages. Combining
                these tools gives you higher-probability setups for optimal
                entries and precise stop loss placements.
              </p>
            </>
          )}
        </SEOArticle>
      )}

      <AdBanner layout="horizontal" />
    </div>
  );
}
