import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, BadgeCheck } from "lucide-react";

/**
 * Slim commerce-assurance strip for the Shop page. Reinforces the
 * transactional trust signals shoppers look for while browsing (shipping,
 * returns, secure payment, authenticity). Intentionally distinct from the
 * Home "Why Choose Us" section, which tells the craftsmanship story.
 */
const ITEMS = [
  {
    Icon: Truck,
    title: "Free Shipping",
    sub: "On orders over ₹1999",
  },
  {
    Icon: RotateCcw,
    title: "Easy 7-Day Returns",
    sub: "Hassle-free exchanges",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Checkout",
    sub: "100% protected payments",
  },
  {
    Icon: BadgeCheck,
    title: "Handcrafted & Authentic",
    sub: "Artisan-made, never mass-produced",
  },
];

export default function ShopAssurance() {
  return (
    <section className="bg-cream-100 dark:bg-ink-900 pt-10 lg:pt-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/5 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.18)]">
          <ul className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 dark:divide-slate-700/70">
            {ITEMS.map(({ Icon, title, sub }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-3.5 p-5 sm:p-6"
              >
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-700 dark:to-slate-700/60 text-brand-500 ring-1 ring-brand-200/60 dark:ring-slate-600">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                    {sub}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
