import { useState } from "react";
import { InputIcon } from "@/components/icons/InputIcon";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { useI18n } from "@/i18n";
import { InputField } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { calculateLoan } from "@/utils/calculators";
import { formatCurrency, getCurrencySymbol } from "@/utils/formatters";

export function LoanCalculatorPage() {
  const { t, currency } = useI18n();
  const tt = t.tools.loanCalc;

  const [loanAmount, setLoanAmount] = useState(3000000);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const result = calculateLoan(loanAmount, annualRate, loanTerm);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">{tt.name}</h1>
      <p className="page-description">{tt.desc}</p>

      <div className="calculator-grid">
        <div className="input-section">
          <div className="section-title">
            <InputIcon width={18} height={18} /> {t.common.input}
          </div>
          <InputField
            label={tt.loanAmount}
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            suffix={getCurrencySymbol(currency)}
            min={0}
          />
          <InputField
            label={tt.annualRate}
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            suffix="%"
            min={0}
            step={0.1}
          />
          <InputField
            label={tt.loanTerm}
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            suffix={t.common.years}
            min={1}
            max={50}
          />
          <div className="button-row">
            <Button
              variant="secondary"
              onClick={() => {
                setLoanAmount(3000000);
                setAnnualRate(6.5);
                setLoanTerm(30);
              }}
            >
              {t.common.reset}
            </Button>
          </div>
        </div>

        <div className="result-section">
          <div className="section-title">
            <ChartBarIcon width={18} height={18} /> {t.common.results}
          </div>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">{tt.monthlyPayment}</span>
              <span className="value">
                {formatCurrency(result.monthlyPayment, currency)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.totalInterest}</span>
              <span className="value negative">
                {formatCurrency(result.totalInterest, currency)}
              </span>
            </div>
            <div className="result-item">
              <span className="label">{tt.totalPaid}</span>
              <span className="value">
                {formatCurrency(result.totalPaid, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
