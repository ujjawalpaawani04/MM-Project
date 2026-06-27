import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import { PLATFORM_THEMES } from "./platformThemes";

/**
 * Platform-aware segmented tab switcher. The active pill morphs between tabs
 * (Framer Motion shared layout) and adopts the *target* platform's gradient -
 * so the YouTube tab glows red, Instagram runs the warm gradient, and Facebook
 * goes blue. The whole control adapts to the active theme's light/dark surface.
 * Fully keyboard accessible via role="tablist".
 */
export default function CommunityTabs({ tabs, active, onChange, theme }) {
  return (
    <div
      role="tablist"
      aria-label="Community channels"
      className={cn(
        "mx-auto flex w-full max-w-xl items-center gap-1.5 rounded-2xl p-1.5 shadow-lg",
        theme.isDark
          ? "border border-white/10 bg-white/5 backdrop-blur-xl"
          : "border border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const Icon = tab.icon;
        const tabTheme = PLATFORM_THEMES[tab.id];

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200",
              isActive
                ? "text-white"
                : theme.isDark
                ? "text-white/55 hover:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="community-tab-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-xl bg-gradient-to-r shadow-md",
                  tabTheme.tabActive
                )}
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
