import type { SelectHTMLAttributes } from "react";
import { useId } from "react";
import styles from "./Select.module.css";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export function SelectField({
  label,
  options,
  className = "",
  ...props
}: SelectFieldProps) {
  const id = useId();
  return (
    <div className={`${styles.selectField} ${className}`}>
      <label htmlFor={id} className={styles.selectLabel}>
        {label}
      </label>
      <select id={id} className={styles.selectControl} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
