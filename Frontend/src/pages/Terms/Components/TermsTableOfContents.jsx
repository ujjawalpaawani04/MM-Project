import Card from "../../../components/common/Card";

export default function TermsTableOfContents({ sections }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <Card className="p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">
            On this page
          </p>
          <nav className="mt-4 space-y-1">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
              >
                <span className="text-xs font-bold text-brand-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.heading}
              </a>
            ))}
          </nav>
        </Card>
      </div>
    </aside>
  );
}
