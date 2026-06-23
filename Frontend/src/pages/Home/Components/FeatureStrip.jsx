import { FiHeart, FiShield, FiGlobe, FiLock } from "react-icons/fi";

const features = [
  { Icon: FiHeart, label: "Handcrafted", sub: "with love" },
  { Icon: FiShield, label: "Premium", sub: "quality" },
  { Icon: FiGlobe, label: "Worldwide", sub: "shipping" },
  { Icon: FiLock, label: "Secure", sub: "payments" },
];

/**
 * The white trust-badge pill that overlaps the bottom of the hero.
 * Rendered as an absolutely-positioned card inside the Hero section.
 */
export default function FeatureStrip() {
  return (
    <div className="rounded-[28px] bg-white dark:bg-slate-800 shadow-[0_24px_60px_rgba(15,23,42,0.18)] px-6 sm:px-10 py-6">
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 divide-y lg:divide-y-0 lg:divide-x divide-[#e24486] dark:divide-slate-700">
        {features.map(({ Icon, label, sub }) => (
          <li
            key={label}
            className="flex items-center gap-3 justify-center lg:px-4 pt-6 first:pt-0 lg:pt-0"
          >
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full border border-[#e34786]/30 text-[#e34786]">
              <Icon className="text-lg" />
            </span>
            <span className="text-sm font-semibold leading-tight text-gray-800 dark:text-gray-100">
              {label}
              <br />
              {sub}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
