import { Truck, RotateCcw, BadgeCheck, Lock } from "lucide-react";

const benefits = [
  { Icon: Lock, title: "Secure Checkout", text: "256-bit SSL encrypted payments" },
  { Icon: Truck, title: "Free Shipping", text: "On all orders above ₹1999" },
  { Icon: RotateCcw, title: "7-Day Returns", text: "Hassle-free easy returns" },
  { Icon: BadgeCheck, title: "100% Authentic", text: "Handcrafted, quality-checked" },
];

export default function CartBenefits() {
  return (
    <section className="mt-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 shadow-sm"
          >
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300 shrink-0">
              <Icon size={20} />
            </span>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
