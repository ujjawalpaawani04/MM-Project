/** Human-friendly "x days ago" with a sensible absolute fallback. */
export function formatPublished(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const day = 86_400_000;
  const days = Math.floor(diff / day);

  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** True when a video was published within the last 7 days. */
export const isRecent = (iso) =>
  Date.now() - new Date(iso).getTime() < 7 * 86_400_000;
