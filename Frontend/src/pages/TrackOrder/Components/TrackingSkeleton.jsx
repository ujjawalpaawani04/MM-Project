/** Loading placeholder shown while an order is being looked up. */
const Bar = ({ className = "" }) => (
  <div className={`rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse ${className}`} />
);

export default function TrackingSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Order details */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-5">
            <div className="space-y-2">
              <Bar className="h-3 w-24" />
              <Bar className="h-5 w-32" />
            </div>
            <Bar className="h-6 w-24 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Bar className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Bar className="h-3 w-20" />
                  <Bar className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
          <Bar className="h-5 w-36" />
          <div className="mt-10 flex justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Bar className="h-12 w-12 rounded-full" />
                <Bar className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-4">
        <Bar className="h-5 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Bar className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Bar className="h-4 w-32" />
              <Bar className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
