/** จัดรูปแบบตัวเลขเป็นสกุลเงินบาท */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** จัดรูปแบบตัวเลขให้มีเครื่องหมายคั่นหลักพัน */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** จัดรูปแบบเปอร์เซ็นต์ */
export function formatPercent(value: number, decimals = 2): string {
  return `${formatNumber(value, decimals)}%`;
}

/** จัดรูปแบบตัวคูณ multiplier */
export function formatMultiplier(value: number): string {
  return `${formatNumber(value, 2)}x`;
}
