/** Dark-theme loading placeholder that mirrors VideoCard's exact structure and
 *  height (16:9 media, reserved 2-line title, footer row) so the grid never
 *  reflows when real videos replace the skeletons. */
export default function VideoCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="aspect-video w-full bg-white/10" />
      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[2.625rem] space-y-2">
          <div className="h-4 w-11/12 rounded bg-white/10" />
          <div className="h-4 w-2/3 rounded bg-white/10" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-7 w-20 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
}
