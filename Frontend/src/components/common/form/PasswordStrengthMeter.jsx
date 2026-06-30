import { FiCheck } from "react-icons/fi";
import { evaluatePassword } from "../../../utils/passwordStrength";

/**
 * Live password strength meter: a 4-segment bar that fills + colours with
 * strength, a label, and (optionally) the remaining criteria to satisfy.
 * Renders nothing until the user starts typing.
 *
 *   <PasswordStrengthMeter value={watch("password")} />
 */
export default function PasswordStrengthMeter({ value = "", showChecklist = true }) {
  if (!value) return null;
  const { score, label, color, text, failed } = evaluatePassword(value);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < score ? color : "bg-gray-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold w-16 text-right ${text}`}>
          {label}
        </span>
      </div>

      {showChecklist && failed.length > 0 && (
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {failed.map((f) => (
            <li
              key={f.key}
              className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500"
            >
              <FiCheck size={11} className="shrink-0 opacity-50" />
              {f.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
