import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import styles from "./Input.module.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
  hint?: string;
}

export function InputField({
  label,
  suffix,
  hint,
  className = "",
  ...props
}: InputFieldProps) {
  const id = useId();
  return (
    <div className={`${styles.inputField} ${className}`}>
      <label htmlFor={id} className={styles.inputLabel}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input id={id} className={styles.inputControl} {...props} />
        {suffix && <span className={styles.inputSuffix}>{suffix}</span>}
      </div>
      {hint && <span className={styles.inputHint}>{hint}</span>}
    </div>
  );
}
