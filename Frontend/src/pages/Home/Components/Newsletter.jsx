import { useForm } from "react-hook-form";
import { useToast } from "../../../context/ToastContext";
import { VALIDATION } from "../../../utils/validators";

const Newsletter = () => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const subscribe = (data) => {
    console.info("Newsletter subscribe:", data.email);
    toast.success("You're on the list - watch your inbox for first looks ✨");
    reset();
  };

  return (
    <section className="bg-cream-100 dark:bg-ink-900 lg:py-20 py-10 dark:border-slate-800 dark:border-b">
      <div className="max-w-7xl mx-auto px-5 ">
        <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-800 shadow-[0_24px_60px_rgba(15,23,42,0.10)] px-6 sm:px-12 py-10">
          {/* Decorative blooms */}
          <div className="pointer-events-none absolute -left-10 -top-10 w-40 h-40 rounded-full bg-pink-200/50 dark:bg-pink-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-rose-200/50 dark:bg-rose-500/10 blur-2xl" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                First look at{" "}
                <span className="text-brand-500">every new release</span>
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Join the collectors' list for early access to limited drops,
                restock alerts, and subscriber-only offers. No spam, ever.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(subscribe)}
              noValidate
              className="w-full max-w-md"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <input
                  type="email"
                  placeholder="you@email.com"
                  aria-label="Email address"
                  aria-invalid={!!errors.email}
                  className={`flex-1 h-12 rounded-full border bg-gray-50 dark:bg-slate-900 px-5 text-sm text-gray-700 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200 dark:border-slate-600"
                  }`}
                  {...register("email", VALIDATION.email)}
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-8 font-semibold text-white hover:opacity-95 transition"
                >
                  Join the List
                </button>
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-500 text-center sm:text-left">
                  {errors.email.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
