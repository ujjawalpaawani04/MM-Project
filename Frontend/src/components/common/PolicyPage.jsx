import PageHeader from "./PageHeader";

/** Renders a simple legal/policy page from a list of { heading, body } sections. */
export default function PolicyPage({ title, intro, sections, label, hideHeader = false }) {
  return (
    <>
      {!hideHeader && (
        <PageHeader
          title={title}
          subtitle={intro}
          breadcrumbs={[{ label: "Home", to: "/" }, { label }]}
        />
      )}
      <section className="max-w-[820px] mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="space-y-5">
          {sections.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-200 dark:hover:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 grid place-items-center h-9 w-9 rounded-xl bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300 font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {s.heading}
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          Last updated: June 2026
        </div>
      </section>
    </>
  );
}
