/**
 * A subtle decorative divider used between content blocks on the static
 * information pages. Centered diamond flourish with fading pink rules.
 */
export default function SectionDivider({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-brand-300/60 dark:to-brand-300/30" />
      <span className="text-brand-500 text-xs rotate-45 leading-none">◆</span>
      <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-brand-300/60 dark:to-brand-300/30" />
    </div>
  );
}
