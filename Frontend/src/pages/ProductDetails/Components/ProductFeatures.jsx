import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const features = [
  { Icon: Truck, label: "Free shipping over ₹1999" },
  { Icon: ShieldCheck, label: "Authentic & handcrafted" },
  { Icon: RotateCcw, label: "7-day easy returns" },
];

/** Trust / assurance badges shown under the product actions. */
export default function ProductFeatures() {
  return (
    <div className="mt-7 grid grid-cols-3 gap-3 text-center">
      {features.map(({ Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
        >
          <Icon className="text-brand-400" size={22} />
          {label}
        </div>
      ))}
    </div>
  );
}
