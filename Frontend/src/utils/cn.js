/**
 * Tiny className joiner. Filters out falsy values so you can write:
 *   cn("base", isActive && "active", disabled && "opacity-50")
 * Kept dependency-free on purpose (no clsx/tailwind-merge needed for this project).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
