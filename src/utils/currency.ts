/**
 * Centralized utility to handle currency conversion between assets and user preference.
 * Prevents double-converting assets that are already in the target currency (e.g., Thai stocks in THB).
 */
export function getConversionRate(
  assetCurrency: string,
  targetCurrency: string,
  usdThbRate: number,
): number {
  const asset = assetCurrency.toUpperCase();
  const target = targetCurrency.toUpperCase();

  // If already in the target currency, no conversion needed
  if (asset === target) return 1;

  // Asset is USD, user wants THB
  if (asset === "USD" && target === "THB") {
    return usdThbRate;
  }

  // Asset is THB (or other currency we treat as base for Thai market), user wants USD
  if (asset === "THB" && target === "USD") {
    return 1 / usdThbRate;
  }

  // Fallback for other currencies or missing data
  return 1;
}
