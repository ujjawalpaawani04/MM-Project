import { motion } from "framer-motion";
import { FiUsers, FiVideo, FiEye } from "react-icons/fi";
import useChannel from "../../../hooks/useChannel";

/** 1234567 -> "1.2M", 2790 -> "2.8K". */
function compact(n) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n || 0);
}

/**
 * Glassmorphic stats band powered by GET /api/youtube/channel (via useChannel).
 * Non-critical: if the request fails it renders nothing rather than blocking
 * the page.
 */
export default function ChannelStats() {
  const { channel } = useChannel();
  if (!channel) return null;

  const stats = [
    { icon: FiUsers, label: "Subscribers", value: compact(channel.subscriberCount) },
    { icon: FiVideo, label: "Videos", value: compact(channel.videoCount) },
    { icon: FiEye, label: "Total views", value: compact(channel.viewCount) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-3 gap-3 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/50 sm:gap-6 sm:p-6"
    >
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex flex-col items-center text-center">
          <span className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-slate-700/70">
            <Icon size={18} />
          </span>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
            {value}
          </span>
          <span className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
