import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from "react-icons/fi";

const badges = [
  { Icon: FiTruck, title: "Free Shipping", sub: "On all orders above ₹999" },
  { Icon: FiRefreshCw, title: "Easy Returns", sub: "14 days return policy" },
  { Icon: FiShield, title: "Secure Payments", sub: "100% secure checkout" },
  { Icon: FiHeadphones, title: "24/7 Support", sub: "We are here to help" },
];

export default function TrustBadges() {
  return (
    <section className="bg-cream dark:bg-ink-900 pb-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-[#e34786]/15 pt-10">
          {badges.map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-pink-100 dark:bg-slate-800 text-[#e34786]">
                <Icon className="text-lg" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#e34786]">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
