import { Link } from "react-router";
import { FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import Button from "../../../components/common/Button";

const cardClass =
  "flex flex-col items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300";

const channels = [
  { Icon: FiMail, label: "Email us", value: "support@mohanmaya.com", href: "mailto:support@mohanmaya.com" },
  { Icon: FiPhone, label: "Call us", value: "+91 88889 79697", href: "tel:+918888979697" },
  { Icon: FiMessageCircle, label: "Visit", value: "Contact Page", to: "/contact" },
];

function ChannelCard({ Icon, label, value, href, to }) {
  const inner = (
    <>
      <span className="grid place-items-center h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
        <Icon size={20} />
      </span>
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </>
  );

  return to ? (
    <Link to={to} className={cardClass}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cardClass}>
      {inner}
    </a>
  );
}

export default function SupportSection() {
  return (
    <section className="bg-ink-50 dark:bg-ink-900 py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-800 dark:to-slate-900 border border-brand-100/70 dark:border-slate-700 p-8 sm:p-12 text-center">
          <span className="inline-block bg-[#efebe4] dark:bg-slate-700 text-[#e34786] dark:text-brand-300 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-lg">
            Support
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Still need help?
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-gray-600 dark:text-gray-300">
            Our team is here Mon-Sat, 9 AM - 6 PM. Reach out and we'll track it
            down for you.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {channels.map((c) => (
              <ChannelCard key={c.label} {...c} />
            ))}
          </div>

          <div className="mt-8">
            <Button to="/contact" size="lg" icon={FaArrowRight} iconRight>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
