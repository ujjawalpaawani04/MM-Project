import { FaPaintBrush, FaBookOpen, FaGem, FaHeart, FaStar } from "react-icons/fa";
import { cn } from "../../../utils/cn";

const values = [
  { Icon: FaPaintBrush, title: "Handcrafted", text: "Every miniature is sculpted and hand-painted by skilled artisans." },
  { Icon: FaBookOpen, title: "Soulful Stories", text: "Each piece carries a chapter of the Mohan-Maya spiritual journey." },
  { Icon: FaGem, title: "Premium Quality", text: "Museum-grade materials and finishes built to last generations." },
  { Icon: FaHeart, title: "Made with Devotion", text: "Crafted with the same devotion the story celebrates." },
  { Icon: FaStar, title: "Timeless Artistry", text: "Designs that stay beautiful and meaningful for years to come." },
];

/** "Our Principles" - core values grid. */
export default function CoreValues() {
  return (
    <section className="bg-cream-100 dark:bg-slate-900 py-16 lg:py-24 border-y border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold">
            Our Principles
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Our Core Values
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-6">
          {values.map(({ Icon, title, text }) => (
            <div
              key={title}
              className={cn(
                "text-center px-2 border-gray-100 dark:border-slate-800",
                "lg:border-r lg:[&:nth-child(5)]:border-r-0"
              )}
            >
              <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-500 dark:text-brand-300 ring-1 ring-brand-100 dark:ring-slate-700">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
