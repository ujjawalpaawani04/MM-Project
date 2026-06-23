import { forwardRef, useId } from "react";
import { cn } from "../../../utils/cn";

/**
 * Styled <select> that matches FormField and works with RHF via a forwarded ref.
 * Pass options as [{ value, label }] or plain strings.
 */
const SelectField = forwardRef(function SelectField(
  {
    label,
    error,
    required,
    options = [],
    placeholder,
    className,
    id: idProp,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const errId = `${id}-error`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
        >
          {label}
          {required && <span className="text-brand-500"> *</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors focus:outline-none",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 dark:border-slate-700 focus:border-brand-400"
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

export default SelectField;
