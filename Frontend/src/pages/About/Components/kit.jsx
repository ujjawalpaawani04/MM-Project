/* eslint-disable react-refresh/only-export-components -- small co-located kit of
   helpers + tiny presentational atoms shared only by the About sections. */
/**
 * Small shared building blocks for the About page sections. Keeps the premium
 * visual language (eyebrow pill, entrance motion, soft decorative glows)
 * consistent across every section without duplicating markup.
 */

// Reusable scroll-entrance preset. Spread onto any <motion.*> element:
//   <motion.div {...fadeUp} />
// Override `transition` to add a stagger delay when mapping over lists.
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/** Gradient pill used above every section heading (matches the home page). */
export function Eyebrow({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/20 ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Soft, blurred brand-coloured blob for subtle section backgrounds. Purely
 * decorative (aria-hidden) and pointer-events-none so it never interferes.
 */
export function Glow({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 rounded-full bg-gradient-to-br from-brand-300/40 to-rose-300/30 blur-3xl dark:from-brand-500/20 dark:to-rose-500/10 ${className}`}
    />
  );
}

/** Faint dotted texture for premium section backgrounds (theme-aware). */
export const dotPattern = {
  backgroundImage:
    "radial-gradient(currentColor 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};
