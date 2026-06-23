import Breadcrumbs from "./Breadcrumbs";

/** Reusable hero band for interior pages (About, Contact, legal, etc.). */
export default function PageHeader({ title, subtitle, breadcrumbs }) {
  return (
    <section className="bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-900 dark:to-slate-800 py-12 lg:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
