import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "../../utils/cn";

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

/**
 * Accessible, reusable modal: Escape to close, backdrop click to close,
 * body scroll lock, focus moved into the dialog, and animated via Framer Motion.
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  hideClose = false,
  className,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const FOCUSABLE =
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
    const focusable = () =>
      Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []).filter(
        (el) => el.offsetParent !== null
      );

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      // Trap Tab focus inside the dialog so keyboard users can't tab out into the
      // page behind the modal.
      if (e.key === "Tab") {
        const items = focusable();
        if (items.length === 0) {
          e.preventDefault();
          panelRef.current?.focus();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Remember what was focused before opening so we can restore it on close.
    const previouslyFocused = document.activeElement;
    // Move focus to the first focusable control (or the dialog) for keyboard users.
    const id = requestAnimationFrame(() => {
      const items = focusable();
      (items[0] || panelRef.current)?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(id);
      // Restore focus to the trigger element for a seamless keyboard flow.
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Dialog"}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl outline-none max-h-[90vh] overflow-y-auto",
              sizeMap[size],
              className
            )}
          >
            {(title || !hideClose) && (
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
                {!hideClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
