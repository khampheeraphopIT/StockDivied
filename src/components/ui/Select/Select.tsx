import type { SelectHTMLAttributes } from "react";
import { useId } from "react";
import "./Select.css";

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
    <div className={`select-field ${className}`}>
      <label htmlFor={id} className="select-label">
        {label}
      </label>
      <select id={id} className="select-control" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
