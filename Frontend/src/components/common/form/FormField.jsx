import { forwardRef, useId } from "react";
import { cn } from "../../../utils/cn";

/**
 * Reusable text-style field (text / email / tel / number…) designed to plug
 * straight into React Hook Form:
 *
 *   <FormField label="Email" type="email" error={errors.email?.message}
 *              {...register("email", { required: "Email is required" })} />
 *
 * Forwards its ref so RHF can register the underlying <input>. An optional
 * left `icon` and a trailing `endAdornment` (e.g. a show/hide toggle) are
 * supported. Accessibility: label and input are linked, errors get
 * aria-describedby and the field is marked aria-invalid.
 */
const FormField = forwardRef(function FormField(
  {
    label,
    error,
    hint,
    icon: Icon,
    endAdornment,
    required,
    className,
    id: idProp,
    ...inputProps
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;

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
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={cn(error && errId, hint && hintId) || undefined}
          className={cn(
            "w-full py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 transition-colors focus:outline-none",
            Icon ? "pl-11 pr-4" : "px-4",
            endAdornment && "pr-11",
            error
              ? "border-red-400 focus:border-red-400"
              : "border-gray-200 dark:border-slate-700 focus:border-brand-400"
          )}
          {...inputProps}
        />
        {endAdornment && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
      {error ? (
        <p id={errId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-1.5 text-xs text-gray-400">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

export default FormField;
