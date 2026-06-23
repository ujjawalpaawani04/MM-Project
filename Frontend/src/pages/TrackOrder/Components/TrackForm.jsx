import { useForm } from "react-hook-form";
import { FiSearch, FiPackage } from "react-icons/fi";
import Button from "../../../components/common/Button";

/**
 * Order-tracking form (single Tracking / Order number field).
 * Calls onTrack(value) on submit; the parent owns the loading + lookup state.
 */
export default function TrackForm({ onTrack, loading, hasResult, defaultValue = "" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { tracking: defaultValue } });

  const submit = (data) => onTrack(data.tracking);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl p-6 sm:p-8 lg:p-10">
      <div className="flex items-center gap-4">
        <span className="grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg shrink-0">
          <FiPackage size={22} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Track Your Order
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your tracking number to view live delivery status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="mt-7" noValidate>
        <label
          htmlFor="tracking"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
        >
          Tracking Number
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiPackage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="tracking"
              placeholder="e.g. MM-2026-000123"
              aria-invalid={!!errors.tracking}
              autoComplete="off"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition"
              {...register("tracking", {
                required: "Please enter your tracking number",
              })}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            icon={FiSearch}
            className="sm:w-auto"
          >
            {hasResult ? "Track Again" : "Track Order"}
          </Button>
        </div>
        {errors.tracking && (
          <p className="mt-1.5 text-xs text-red-500">{errors.tracking.message}</p>
        )}
        <p className="mt-3 text-xs text-gray-400">
          Tip: orders placed at checkout are saved on this device. Try the demo
          number{" "}
          <button
            type="button"
            onClick={() => onTrack("MM-2026-000123")}
            className="font-semibold text-brand-500 hover:underline"
          >
            MM-2026-000123
          </button>
          .
        </p>
      </form>
    </div>
  );
}
