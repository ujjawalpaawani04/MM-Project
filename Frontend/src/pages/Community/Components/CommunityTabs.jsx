import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

/**
 * Segmented, glassmorphic tab switcher with an animated active pill
 * (Framer Motion shared layout). Fully keyboard accessible via role="tablist".
 */
export default function CommunityTabs({ tabs, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Community channels"
      className="mx-auto flex w-full max-w-md items-center gap-1 rounded-2xl border border-white/40 bg-white/60 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/60"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200",
              isActive
                ? "text-white"
                : "text-gray-600 hover:text-brand-500 dark:text-gray-300"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="community-tab-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 shadow-md shadow-pink-500/25"
              />
            )}
            <Icon size={17} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
