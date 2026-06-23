import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";

import SectionHeading from "../../../components/common/SectionHeading";

const whyShop = [
  {
    Icon: ShieldCheck,
    title: "Crafted with Devotion",
    text: "Every miniature is sculpted and hand-painted by skilled artisans.",
  },
  {
    Icon: BadgeCheck,
    title: "Museum-Grade Quality",
    text: "Premium materials and finishes built to last generations.",
  },
  {
    Icon: Truck,
    title: "Loved Worldwide",
    text: "Trusted by 5,000+ collectors across 12+ countries.",
  },
];

export default function WhyShop() {
  return (
    <section className="mt-16">
      <SectionHeading title="Why Shop" highlight="With Us" />
      <div className="grid md:grid-cols-3 gap-6">
        {whyShop.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-7 shadow-sm hover:shadow-lg transition-shadow text-center"
          >
            <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
              <Icon size={24} />
            </span>
            <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
