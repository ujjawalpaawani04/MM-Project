import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import Breadcrumbs from "./Breadcrumbs";

/**
 * Premium, reusable hero band for interior pages.
 * Keeps every page visually consistent with the Home hero (brand gradient,
 * eyebrow chip, accent heading, breadcrumbs) while staying fully responsive
 * and dark-mode aware.
 *
 * Props:
 *   breadcrumbs  [{ label, to }]   trail rendered as Home > … > Current
 *   eyebrow      string            small uppercase chip above the title
 *   title        string            main heading
 *   highlight    string            optional accent-coloured part of the title
 *   description  string            short supporting paragraph
 *   actions      ReactNode         optional CTA buttons
 *   align        "center" | "left" defaults to "center"
 *   compact      boolean           tighter vertical padding
 */
export default function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  highlight,
  description,
  actions,
  align = "center",
  compact = false,
  image,
}) {
  const centered = align === "center";

  // Image-backed hero - premium variant for marquee pages (e.g. About).
  if (image) {

    return (
      <section className="relative overflow-hidden h-[70vh] max-h-[1000px] lg:pt-30 pt:10 bg-ink-900 content-center">
        {/* Background image (z-0) */}
        <img
          src={image}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        {/* Readability overlay (z-0, above the image) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        {/* Content (z-10, always above image + overlay) */}
        <div className="relative z-10 max-w-7xl mx-auto px-5">


        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "relative  mx-auto py-5 ",
            centered && "text-center"
          )}
        >
          {eyebrow && (
            <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white  px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-lg">
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1]",
              eyebrow && "mt-5"
            )}
          >
            {title}
            {highlight && <span className="text-[#e34786]"> {highlight}</span>}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-5 text-gray-200 text-base sm:text-lg leading-relaxed max-w-xl",
                centered && "mx-auto max-w-2xl"
              )}
            >
              {description}
            </p>
          )}
          {breadcrumbs && (
            <div className={cn("mt-6", centered && "flex justify-center")}>
              <Breadcrumbs items={breadcrumbs} onDark />
            </div>
          )}
          {actions && (
            <div
              className={cn(
                "mt-8 flex flex-wrap gap-4",
                centered && "justify-center"
              )}
            >
              {actions}
            </div>
          )}
        </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-brand-100/70 dark:border-slate-800",
        "bg-gradient-to-br from-brand-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800",
        compact ? "py-12 lg:py-16" : "py-16 lg:py-24"
      )}
    >
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-500/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/10"
      />
      {/* Subtle dot grid, faded toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 [background-image:radial-gradient(#ffc9dd_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative max-w-7xl mx-auto px-4 sm:px-6",
          centered && "text-center"
        )}
      >
        {breadcrumbs && (
          <div className={cn("mb-5", centered && "flex justify-center")}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {eyebrow && (
          <span className="inline-block bg-[#efebe4] dark:bg-slate-700 text-[#e34786] dark:text-brand-300 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-lg">
            {eyebrow}
          </span>
        )}

        <h1 className="max-w-7xl ">
          {title}
          {highlight && <span className="text-[#e34786]"> {highlight}</span>}
        </h1>

        {description && (
          <p
            className={cn(
              "mt-5 text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl",
              centered && "mx-auto"
            )}
          >
            {description}
          </p>
        )}

        {actions && (
          <div
            className={cn(
              "mt-8 flex flex-wrap gap-4",
              centered && "justify-center"
            )}
          >
            {actions}
          </div>
        )}
      </motion.div>
    </section>
  );
}
