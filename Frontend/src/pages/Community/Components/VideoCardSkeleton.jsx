/** Dark-theme loading placeholder that mirrors VideoCard so the grid doesn't
 *  reflow when real videos arrive. */
export default function VideoCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="aspect-video w-full bg-white/10" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-11/12 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-7 w-20 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
}
