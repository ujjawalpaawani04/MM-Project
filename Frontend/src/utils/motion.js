/**
 * Shared Framer Motion presets so scroll-reveal animations stay consistent
 * across pages. Spread onto a <motion.div {...fadeUp} /> and optionally
 * override `transition` for staggered delays:
 *   <motion.div {...fadeUp} transition={{ duration: 0.45, delay: i * 0.08 }} />
 */
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};
