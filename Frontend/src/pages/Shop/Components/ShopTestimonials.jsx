import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import SectionHeading from "../../../components/common/SectionHeading";

/**
 * "Customer Testimonials" - three premium testimonial cards with a gradient
 * avatar initial, 5-star rating and a subtle brand quote mark.
 */
const TESTIMONIALS = [
  {
    name: "Ananya Rao",
    location: "Bengaluru, India",
    rating: 5,
    quote:
      "The detailing on my Krishna figure is breathtaking - you can see every brushstroke. It has become the centerpiece of our puja shelf.",
  },
  {
    name: "Daniel Whitfield",
    location: "London, UK",
    rating: 5,
    quote:
      "Shipping to the UK was flawless and the packaging felt like opening a luxury gift. The craftsmanship genuinely exceeded my expectations.",
  },
  {
    name: "Priya Menon",
    location: "Dubai, UAE",
    rating: 5,
    quote:
      "I gifted the Mohan & Maya piece to my mother and she was moved to tears. These miniatures carry so much heart and devotion.",
  },
];

export default function ShopTestimonials() {
  return (
    <section className="bg-gradient-to-br from-cream to-brand-50 dark:from-ink-900 dark:to-slate-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Loved by"
          highlight="Collectors"
          subtitle="Real words from the people who keep our miniatures close."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 lg:p-7"
            >
              <FaQuoteLeft
                aria-hidden="true"
                className="absolute top-6 right-6 text-3xl text-brand-100 dark:text-slate-700"
              />

              <div className="flex items-center gap-1 text-[#e34786]" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <FaStar
                    key={s}
                    className={s < t.rating ? "text-[#e34786]" : "text-gray-200 dark:text-slate-600"}
                  />
                ))}
              </div>

              <blockquote className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white font-semibold">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {t.location}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
