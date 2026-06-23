import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import FormField from "./FormField";

/**
 * Password field with a show/hide toggle, built on top of FormField so it
 * keeps the same styling, error handling and RHF compatibility:
 *
 *   <PasswordField label="Password" error={errors.password?.message}
 *                  {...register("password", { required: "Required" })} />
 */
const PasswordField = forwardRef(function PasswordField(
  { showIcon = true, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      ref={ref}
      type={visible ? "text" : "password"}
      icon={showIcon ? FiLock : undefined}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordField;
