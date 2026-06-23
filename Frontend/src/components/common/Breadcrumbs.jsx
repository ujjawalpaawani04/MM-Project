import { Link } from "react-router";
import { FiChevronRight } from "react-icons/fi";
import { cn } from "../../utils/cn";
 
/**
 * Accessible breadcrumb trail.
 * items: [{ label, to }]  - the last item is rendered as the current page.
 * onDark: lighten colours for use over a dark/image hero background.
 */
export default function Breadcrumbs({ items = [], onDark = false }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm",
          onDark
            ? "text-white/90"
            : "text-white dark:text-gray-400"
        )}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {isLast || !item.to ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-semibold truncate max-w-[200px]",
                    onDark ? "text-white" : "text-white dark:text-white"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                // Per-link hover: only the crumb being hovered changes colour.
                <Link
                  to={item.to}
                  className="transition-colors hover:text-[#e34786]"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && <FiChevronRight className="shrink-0 opacity-60" size={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
