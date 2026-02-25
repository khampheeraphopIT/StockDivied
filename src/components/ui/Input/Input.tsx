import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import "./Input.css";

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
    <div className={`input-field ${className}`}>
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="input-wrapper">
        <input id={id} className="input-control" {...props} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {hint && <span className="input-hint">{hint}</span>}
    </div>
  );
}
