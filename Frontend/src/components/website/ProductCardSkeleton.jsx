/**
 * Loading placeholder that mirrors the ProductCard layout (square image +
 * name, meta, price and button rows). Uses the existing neutral palette and a
 * subtle pulse so the grid keeps its shape while products resolve.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="aspect-square w-full bg-gray-100 dark:bg-slate-700 animate-pulse" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-slate-700 animate-pulse" />
        <div className="mt-auto space-y-3 pt-2">
          <div className="h-5 w-2/5 rounded bg-gray-100 dark:bg-slate-700 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
