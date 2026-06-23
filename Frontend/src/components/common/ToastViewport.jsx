import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const config = {
  success: { Icon: FiCheckCircle, ring: "border-green-500/30", accent: "text-green-500" },
  error: { Icon: FiAlertCircle, ring: "border-red-500/30", accent: "text-red-500" },
  info: { Icon: FiInfo, ring: "border-brand-400/30", accent: "text-brand-400" },
};

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-[1000] flex flex-col gap-3 w-[min(92vw,360px)]"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const { Icon, ring, accent } = config[t.type] || config.info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 rounded-xl border ${ring} bg-white dark:bg-slate-800 shadow-lg p-4`}
            >
              <Icon className={`text-xl shrink-0 mt-0.5 ${accent}`} />
              <p className="flex-1 text-sm text-gray-800 dark:text-gray-100">
                {t.message}
              </p>
              <button
                onClick={() => onDismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
