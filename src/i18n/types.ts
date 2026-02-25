export type Locale = "th" | "en";
export type Currency = "THB" | "USD";

export interface TranslationKeys {
  // App
  appName: string;
  appDescription: string;
  appTagline: string;

  // Navigation
  nav: {
    home: string;
    calculators: string;
    tools: string;
    guide: string;
  };

  // Home Page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    getStarted: string;
    toolsTitle: string;
    toolsSubtitle: string;
    beginnerTitle: string;
    beginnerDesc: string;
  };

  // Common
  common: {
    calculate: string;
    reset: string;
    result: string;
    results: string;
    input: string;
    output: string;
    chart: string;
    share: string;
    currency: string;
    percent: string;
    years: string;
    months: string;
    perYear: string;
    perMonth: string;
    baht: string;
    shares: string;
    units: string;
    total: string;
    language: string;
    backToHome: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
  };

  // Tool Names
  tools: {
    dividendCalc: {
      name: string;
      desc: string;
      sharePrice: string;
      annualDividend: string;
      sharesOwned: string;
      taxRate: string;
      dividendYield: string;
      annualIncome: string;
      monthlyIncome: string;
      afterTaxIncome: string;
      payoutRatio: string;
      eps: string;
    };
    compoundInterest: {
      name: string;
      desc: string;
      principal: string;
      monthlyContribution: string;
      annualRate: string;
      years: string;
      compoundFrequency: string;
      futureValue: string;
      totalContributions: string;
      totalInterest: string;
      monthly: string;
      quarterly: string;
      semiAnnually: string;
      annually: string;
    };
    peRatio: {
      name: string;
      desc: string;
      stockPrice: string;
      eps: string;
      industryPE: string;
      peRatio: string;
      fairValue: string;
      valuation: string;
      overvalued: string;
      undervalued: string;
      fairlyValued: string;
    };
    cagr: {
      name: string;
      desc: string;
      beginValue: string;
      endValue: string;
      years: string;
      cagrResult: string;
      absoluteReturn: string;
      totalGrowth: string;
    };
    positionSize: {
      name: string;
      desc: string;
      accountSize: string;
      riskPercent: string;
      entryPrice: string;
      stopLoss: string;
      positionShares: string;
      riskAmount: string;
      positionValue: string;
    };
    profitLoss: {
      name: string;
      desc: string;
      buyPrice: string;
      sellPrice: string;
      quantity: string;
      commission: string;
      grossPL: string;
      netPL: string;
      roi: string;
      breakEvenPrice: string;
    };
    dcaSimulator: {
      name: string;
      desc: string;
      monthlyInvestment: string;
      annualReturn: string;
      years: string;
      initialInvestment: string;
      totalInvested: string;
      portfolioValue: string;
      totalReturn: string;
      vsLumpSum: string;
    };
    loanCalc: {
      name: string;
      desc: string;
      loanAmount: string;
      annualRate: string;
      loanTerm: string;
      monthlyPayment: string;
      totalInterest: string;
      totalPaid: string;
    };
    breakEven: {
      name: string;
      desc: string;
      fixedCosts: string;
      variableCost: string;
      pricePerUnit: string;
      breakEvenUnits: string;
      breakEvenRevenue: string;
      marginOfSafety: string;
      currentSales: string;
    };
    investmentCompare: {
      name: string;
      desc: string;
      investment: string;
      investmentA: string;
      investmentB: string;
      name_: string;
      amount: string;
      rate: string;
      years: string;
      finalValue: string;
      difference: string;
      winner: string;
    };
  };

  // Guide Page
  guide: {
    title: string;
    subtitle: string;
    sections: {
      id: string;
      title: string;
      content: string;
      formula?: string;
      tip?: string;
    }[];
  };

  // Footer
  footer: {
    rights: string;
    disclaimer: string;
  };
}
