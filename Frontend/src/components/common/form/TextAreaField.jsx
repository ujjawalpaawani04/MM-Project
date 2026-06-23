import { forwardRef, useId } from "react";
import { cn } from "../../../utils/cn";

/**
 * Multi-line counterpart to FormField, RHF-ready via a forwarded ref.
 */
const TextAreaField = forwardRef(function TextAreaField(
  { label, error, hint, required, rows = 5, className, id: idProp, ...props },
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 transition-colors focus:outline-none resize-y",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 dark:border-slate-700 focus:border-brand-400"
        )}
        {...props}
      />
      {error ? (
        <p id={errId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
});

export default TextAreaField;
