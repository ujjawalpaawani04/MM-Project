import { cn } from "../../utils/cn";

/**
 * Surface card used across content/policy pages. Theme-aware (light + dark),
 * with a subtle hover lift. Pass extra classes for padding, ring, layout, etc.
 */
export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
