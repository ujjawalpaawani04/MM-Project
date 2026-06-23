import { motion } from "framer-motion";

/**
 * Generic progress timeline / stepper.
 * Horizontal on desktop (lg+), vertical on mobile, with a pink connector.
 *
 * steps: [{ icon: ReactNode, title: string, description?: string }]
 */
export default function Timeline({ steps = [] }) {
  return (
    <div>
      {/* Desktop: horizontal stepper */}
      <ol className="hidden lg:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative flex flex-col items-center text-center px-2"
          >
            {/* connector */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-7 left-1/2 w-full h-0.5 bg-gradient-to-r from-pink-500 to-rose-400"
              />
            )}
            <span className="relative z-10 grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white text-xl shadow-sm ring-4 ring-cream dark:ring-ink-900">
              {step.icon}
            </span>
            <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            {step.description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            )}
          </motion.li>
        ))}
      </ol>

      {/* Mobile / tablet: vertical stepper */}
      <ol className="lg:hidden relative space-y-7">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="relative flex gap-4"
          >
            <div className="relative flex flex-col items-center">
              <span className="grid place-items-center h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white text-lg shadow-sm">
                {step.icon}
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="flex-1 w-0.5 my-1 bg-gradient-to-b from-pink-500 to-rose-400/40"
                />
              )}
            </div>
            <div className="pb-1 pt-1.5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              {step.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
