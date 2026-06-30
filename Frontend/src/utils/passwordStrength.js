/**
 * Password strength scoring for the strength meter + signup validation.
 * Returns a 0–4 score, a human label, a tailwind colour, and the list of
 * unmet criteria so the UI can nudge the user toward a stronger password.
 */

export const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "lower", label: "A lowercase letter", test: (v) => /[a-z]/.test(v) },
  { key: "upper", label: "An uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "A number", test: (v) => /\d/.test(v) },
  { key: "symbol", label: "A symbol (!@#$…)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const LEVELS = [
  { label: "Too weak", color: "bg-red-500", text: "text-red-500" },
  { label: "Weak", color: "bg-red-500", text: "text-red-500" },
  { label: "Fair", color: "bg-amber-500", text: "text-amber-500" },
  { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", color: "bg-green-500", text: "text-green-600" },
];

/**
 * @param {string} password
 * @returns {{ score:number, label:string, color:string, text:string,
 *             passed:string[], failed:{key:string,label:string}[], percent:number }}
 */
export function evaluatePassword(password = "") {
  const value = String(password);
  const passed = [];
  const failed = [];
  for (const rule of PASSWORD_RULES) {
    (rule.test(value) ? passed : failed).push({ key: rule.key, label: rule.label });
  }

  // Score = number of satisfied criteria, capped at 4; an empty field is 0.
  let score = value ? Math.min(passed.length, 4) : 0;
  // A short password can never read as "Strong", regardless of variety.
  if (value.length < 8 && score > 2) score = 2;

  const level = LEVELS[score];
  return {
    score,
    label: level.label,
    color: level.color,
    text: level.text,
    passed: passed.map((p) => p.key),
    failed,
    percent: (score / 4) * 100,
  };
}

/** Minimum acceptable strength for new passwords (≥ "Fair"). */
export const isAcceptablePassword = (password) =>
  evaluatePassword(password).score >= 2 && String(password).length >= 6;
