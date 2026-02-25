/* ===== Dividend Calculator ===== */
export interface DividendResult {
  dividendYield: number;
  annualIncome: number;
  monthlyIncome: number;
  afterTaxIncome: number;
}

export function calculateDividend(
  sharePrice: number,
  annualDividend: number,
  sharesOwned: number,
  taxRate: number,
): DividendResult {
  const dividendYield =
    sharePrice > 0 ? (annualDividend / sharePrice) * 100 : 0;
  const annualIncome = annualDividend * sharesOwned;
  const monthlyIncome = annualIncome / 12;
  const afterTaxIncome = annualIncome * (1 - taxRate / 100);
  return { dividendYield, annualIncome, monthlyIncome, afterTaxIncome };
}

/* ===== Compound Interest ===== */
export interface CompoundResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  yearlyData: {
    year: number;
    value: number;
    contributions: number;
    interest: number;
  }[];
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number,
): CompoundResult {
  const r = annualRate / 100;
  const n = compoundsPerYear;
  const yearlyData: CompoundResult["yearlyData"] = [];

  let totalContributions = principal;

  for (let y = 1; y <= years; y++) {
    totalContributions = principal + monthlyContribution * 12 * y;
    // FV of principal
    const fvPrincipal = principal * Math.pow(1 + r / n, n * y);
    // FV of annuity (monthly contributions)
    const monthlyRate = r / 12;
    const fvContributions =
      monthlyRate > 0
        ? monthlyContribution *
          ((Math.pow(1 + monthlyRate, 12 * y) - 1) / monthlyRate)
        : monthlyContribution * 12 * y;

    const value = fvPrincipal + fvContributions;
    const interest = value - totalContributions;
    yearlyData.push({
      year: y,
      value,
      contributions: totalContributions,
      interest,
    });
  }

  const last = yearlyData[yearlyData.length - 1];
  return {
    futureValue: last?.value ?? principal,
    totalContributions: last?.contributions ?? principal,
    totalInterest: last?.interest ?? 0,
    yearlyData,
  };
}

/* ===== P/E Ratio ===== */
export interface PERatioResult {
  peRatio: number;
  fairValue: number;
  valuation: "overvalued" | "undervalued" | "fairlyValued";
}

export function calculatePERatio(
  stockPrice: number,
  eps: number,
  industryPE: number,
): PERatioResult {
  const peRatio = eps > 0 ? stockPrice / eps : 0;
  const fairValue = eps * industryPE;
  const diff = peRatio / industryPE;
  let valuation: PERatioResult["valuation"] = "fairlyValued";
  if (diff > 1.1) valuation = "overvalued";
  else if (diff < 0.9) valuation = "undervalued";
  return { peRatio, fairValue, valuation };
}

/* ===== CAGR ===== */
export interface CAGRResult {
  cagr: number;
  absoluteReturn: number;
  totalGrowth: number;
}

export function calculateCAGR(
  beginValue: number,
  endValue: number,
  years: number,
): CAGRResult {
  const cagr =
    beginValue > 0 && years > 0
      ? (Math.pow(endValue / beginValue, 1 / years) - 1) * 100
      : 0;
  const absoluteReturn = endValue - beginValue;
  const totalGrowth = beginValue > 0 ? endValue / beginValue : 0;
  return { cagr, absoluteReturn, totalGrowth };
}

/* ===== Position Size ===== */
export interface PositionSizeResult {
  positionShares: number;
  riskAmount: number;
  positionValue: number;
}

export function calculatePositionSize(
  accountSize: number,
  riskPercent: number,
  entryPrice: number,
  stopLoss: number,
): PositionSizeResult {
  const riskAmount = accountSize * (riskPercent / 100);
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const positionShares =
    riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
  const positionValue = positionShares * entryPrice;
  return { positionShares, riskAmount, positionValue };
}

/* ===== Profit / Loss ===== */
export interface ProfitLossResult {
  grossPL: number;
  netPL: number;
  roi: number;
  breakEvenPrice: number;
}

export function calculateProfitLoss(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  commission: number,
): ProfitLossResult {
  const grossPL = (sellPrice - buyPrice) * quantity;
  const totalCommission = commission * 2; // buy + sell
  const netPL = grossPL - totalCommission;
  const totalCost = buyPrice * quantity + commission;
  const roi = totalCost > 0 ? (netPL / totalCost) * 100 : 0;
  const breakEvenPrice =
    quantity > 0 ? buyPrice + totalCommission / quantity : 0;
  return { grossPL, netPL, roi, breakEvenPrice };
}

/* ===== DCA Simulator ===== */
export interface DCAResult {
  totalInvested: number;
  portfolioValue: number;
  totalReturn: number;
  lumpSumValue: number;
  yearlyData: {
    year: number;
    dca: number;
    lumpSum: number;
    invested: number;
  }[];
}

export function calculateDCA(
  monthlyInvestment: number,
  annualReturn: number,
  years: number,
  initialInvestment: number,
): DCAResult {
  const monthlyRate = annualReturn / 100 / 12;
  const yearlyData: DCAResult["yearlyData"] = [];

  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const invested = initialInvestment + monthlyInvestment * 12 * y;

    // DCA: initial grows + monthly contributions grow
    const fvInitial = initialInvestment * Math.pow(1 + monthlyRate, months);
    const fvDCA =
      monthlyRate > 0
        ? monthlyInvestment *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        : monthlyInvestment * months;
    const dcaValue = fvInitial + fvDCA;

    // Lump Sum: grow only the initial investment (no monthly DCA)
    const lumpSumValue = initialInvestment * Math.pow(1 + monthlyRate, months);

    yearlyData.push({
      year: y,
      dca: dcaValue,
      lumpSum: lumpSumValue,
      invested,
    });
  }

  const last = yearlyData[yearlyData.length - 1];
  return {
    totalInvested: last?.invested ?? 0,
    portfolioValue: last?.dca ?? 0,
    totalReturn: last ? last.dca - last.invested : 0,
    lumpSumValue: last?.lumpSum ?? 0,
    yearlyData,
  };
}

export interface RealDCAResult {
  totalInvested: number;
  portfolioValue: number;
  totalReturn: number;
  totalShares: number;
  lumpSumValue: number;
  lumpSumShares: number;
  yearlyData: {
    year: number;
    dca: number;
    lumpSum: number;
    invested: number;
  }[];
}

export function calculateRealDCA(
  monthlyInvestment: number,
  initialInvestment: number,
  historicalPrices: { timestamp: number; price: number }[],
): RealDCAResult {
  if (historicalPrices.length === 0) {
    return {
      totalInvested: 0,
      portfolioValue: 0,
      totalReturn: 0,
      totalShares: 0,
      lumpSumValue: 0,
      lumpSumShares: 0,
      yearlyData: [],
    };
  }

  const yearlyData: RealDCAResult["yearlyData"] = [];
  let totalShares = 0;
  let invested = 0;

  // Lump sum sim
  const firstPrice = historicalPrices[0].price;
  const lumpSumShares = firstPrice > 0 ? initialInvestment / firstPrice : 0;

  // DCA initial
  if (initialInvestment > 0 && firstPrice > 0) {
    totalShares += initialInvestment / firstPrice;
    invested += initialInvestment;
  }

  // We want to record snapshots at the end of each simulated year
  // For simplicity, we just divide the month index by 12.
  for (let i = 0; i < historicalPrices.length; i++) {
    const p = historicalPrices[i].price;

    // Monthly DCA
    if (i > 0 && p > 0) {
      totalShares += monthlyInvestment / p;
      invested += monthlyInvestment;
    }

    // Record every 12 months or the very last month
    if ((i > 0 && (i + 1) % 12 === 0) || i === historicalPrices.length - 1) {
      const yearLabel = Math.ceil((i + 1) / 12);

      // Prevent duplicate year entries if the last month is exactly a multiple of 12
      if (
        yearlyData.length === 0 ||
        yearlyData[yearlyData.length - 1].year !== yearLabel
      ) {
        yearlyData.push({
          year: yearLabel,
          dca: totalShares * p,
          lumpSum: lumpSumShares * p,
          invested: invested,
        });
      }
    }
  }

  const finalPrice = historicalPrices[historicalPrices.length - 1].price;
  const portfolioValue = totalShares * finalPrice;
  const lumpSumValue = lumpSumShares * finalPrice;

  return {
    totalInvested: invested,
    portfolioValue,
    totalReturn: portfolioValue - invested,
    totalShares,
    lumpSumValue,
    lumpSumShares,
    yearlyData,
  };
}

/* ===== Loan Calculator ===== */
export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  years: number,
): LoanResult {
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / n;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);
  }

  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - principal;
  return { monthlyPayment, totalInterest, totalPaid };
}

/* ===== Break-Even ===== */
export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  marginOfSafety: number;
}

export function calculateBreakEven(
  fixedCosts: number,
  variableCost: number,
  pricePerUnit: number,
  currentSales: number,
): BreakEvenResult {
  const contribution = pricePerUnit - variableCost;
  const breakEvenUnits =
    contribution > 0 ? Math.ceil(fixedCosts / contribution) : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;
  const marginOfSafety =
    currentSales > 0 && breakEvenUnits > 0
      ? ((currentSales - breakEvenUnits) / currentSales) * 100
      : 0;
  return { breakEvenUnits, breakEvenRevenue, marginOfSafety };
}

/* ===== Investment Comparison ===== */
export interface ComparisonResult {
  valueA: number;
  valueB: number;
  difference: number;
  winner: "A" | "B" | "tie";
  yearlyData: { year: number; valueA: number; valueB: number }[];
}

export function calculateComparison(
  amountA: number,
  rateA: number,
  yearsA: number,
  amountB: number,
  rateB: number,
  yearsB: number,
): ComparisonResult {
  const maxYears = Math.max(yearsA, yearsB);
  const yearlyData: ComparisonResult["yearlyData"] = [];

  for (let y = 1; y <= maxYears; y++) {
    const vA =
      y <= yearsA
        ? amountA * Math.pow(1 + rateA / 100, y)
        : amountA * Math.pow(1 + rateA / 100, yearsA);
    const vB =
      y <= yearsB
        ? amountB * Math.pow(1 + rateB / 100, y)
        : amountB * Math.pow(1 + rateB / 100, yearsB);
    yearlyData.push({ year: y, valueA: vA, valueB: vB });
  }

  const last = yearlyData[yearlyData.length - 1];
  const valueA = last?.valueA ?? amountA;
  const valueB = last?.valueB ?? amountB;
  const difference = Math.abs(valueA - valueB);
  let winner: ComparisonResult["winner"] = "tie";
  if (valueA > valueB * 1.001) winner = "A";
  else if (valueB > valueA * 1.001) winner = "B";

  return { valueA, valueB, difference, winner, yearlyData };
}

export interface RealComparisonResult {
  valueA: number;
  valueB: number;
  difference: number;
  winner: "A" | "B" | "tie";
  yearlyData: { year: number; valueA: number; valueB: number }[];
}

export function calculateRealComparison(
  amountA: number,
  historicalPricesA: { timestamp: number; price: number }[],
  amountB: number,
  historicalPricesB: { timestamp: number; price: number }[],
): RealComparisonResult {
  if (historicalPricesA.length === 0 && historicalPricesB.length === 0) {
    return {
      valueA: amountA,
      valueB: amountB,
      difference: Math.abs(amountA - amountB),
      winner: amountA > amountB ? "A" : amountB > amountA ? "B" : "tie",
      yearlyData: [],
    };
  }

  const len = Math.max(historicalPricesA.length, historicalPricesB.length);
  const yearlyData: RealComparisonResult["yearlyData"] = [];

  let sharesA = 0;
  let sharesB = 0;

  if (historicalPricesA.length > 0 && historicalPricesA[0].price > 0) {
    sharesA = amountA / historicalPricesA[0].price;
  }
  if (historicalPricesB.length > 0 && historicalPricesB[0].price > 0) {
    sharesB = amountB / historicalPricesB[0].price;
  }

  for (let i = 0; i < len; i++) {
    const pA =
      i < historicalPricesA.length
        ? historicalPricesA[i].price
        : historicalPricesA[historicalPricesA.length - 1]?.price || 0;
    const pB =
      i < historicalPricesB.length
        ? historicalPricesB[i].price
        : historicalPricesB[historicalPricesB.length - 1]?.price || 0;

    // Snapshot every 12 months or at the end
    if ((i > 0 && (i + 1) % 12 === 0) || i === len - 1) {
      const yearLabel = Math.ceil((i + 1) / 12);
      if (
        yearlyData.length === 0 ||
        yearlyData[yearlyData.length - 1].year !== yearLabel
      ) {
        yearlyData.push({
          year: yearLabel,
          valueA: pA * sharesA || amountA, // fallback to amount if no growth
          valueB: pB * sharesB || amountB,
        });
      }
    }
  }

  const last = yearlyData[yearlyData.length - 1];
  const valueA = last?.valueA ?? amountA;
  const valueB = last?.valueB ?? amountB;
  const difference = Math.abs(valueA - valueB);
  let winner: RealComparisonResult["winner"] = "tie";

  if (valueA > valueB * 1.001) winner = "A";
  else if (valueB > valueA * 1.001) winner = "B";

  return { valueA, valueB, difference, winner, yearlyData };
}
