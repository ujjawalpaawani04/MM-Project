/** Light-theme loading placeholder that mirrors VideoCard's exact structure and
 *  height (16:9 media, reserved 2-line title, footer row) so the grid never
 *  reflows when real videos replace the skeletons. */
export default function VideoCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-video w-full bg-gray-200" />
      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[2.625rem] space-y-2">
          <div className="h-4 w-11/12 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-7 w-20 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
