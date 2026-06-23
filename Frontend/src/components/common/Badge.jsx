import { cn } from "../../utils/cn";

const tones = {
  brand: "bg-gradient-to-r from-pink-500 to-rose-400 text-white",
  success: "bg-green-500 text-white",
  neutral: "bg-gray-800/80 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-blue-500 text-white",
};

export default function Badge({ children, tone = "brand", className }) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold px-3 py-1 rounded-full",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
