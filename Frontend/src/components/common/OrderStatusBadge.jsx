import { cn } from "../../utils/cn";
import { STATUS_META } from "../../utils/orders";

/**
 * Colour set per status tone. Kept here (presentation) while the label/tone
 * mapping lives in utils/orders STATUS_META (data), so both order status and
 * payment status can share the same palette.
 */
const TONES = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  confirmed: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  processing: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  shipped: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  delivered: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
  info: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  success: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
};

const DOTS = {
  pending: "bg-amber-500",
  confirmed: "bg-brand-500",
  processing: "bg-indigo-500",
  shipped: "bg-blue-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
  info: "bg-sky-500",
  success: "bg-green-500",
};

/**
 * Reusable pill for an order or payment status.
 *
 * Pass a `statusKey` (e.g. "shipped", "cancelled") to resolve the label + tone
 * from STATUS_META, or pass an explicit `tone` + `label` for payment badges.
 * A small status dot is shown by default for extra scannability.
 */
export default function OrderStatusBadge({
  statusKey,
  label,
  tone,
  dot = true,
  className,
}) {
  const meta = STATUS_META[statusKey];
  const resolvedTone = tone || meta?.tone || "confirmed";
  const resolvedLabel = label || meta?.label || statusKey;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        TONES[resolvedTone] || TONES.confirmed,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            DOTS[resolvedTone] || DOTS.confirmed
          )}
        />
      )}
      {resolvedLabel}
    </span>
  );
}
