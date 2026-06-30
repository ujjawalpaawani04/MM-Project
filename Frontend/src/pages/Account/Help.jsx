import { Link } from "react-router";
import {
  FiHelpCircle,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";

import { faqs } from "../../data/faqs";
import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import Accordion from "../../components/common/Accordion";

const channels = [
  {
    icon: FiMail,
    label: "Email us",
    value: "support@mohanmaya.com",
    href: "mailto:support@mohanmaya.com",
  },
  {
    icon: FiPhone,
    label: "Call us",
    value: "+91 88889 79697",
    href: "tel:+918888979697",
  },
];

const quickLinks = [
  { icon: FiTruck, label: "Track an order", to: "/track-order" },
  { icon: FiRefreshCw, label: "Shipping & returns", to: "/shipping" },
  { icon: FiHelpCircle, label: "All FAQs", to: "/faq" },
];

export default function Help() {
  return (
    <AccountLayout
      title="Help & Support"
      description="Answers to common questions and ways to reach our team."
      icon={FiHelpCircle}
    >
      <div className="space-y-6">
        {/* Contact channels */}
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-5 hover:border-brand-300 dark:hover:border-brand-400/60 transition-colors"
            >
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-slate-700/70 text-brand-500">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Quick links */}
        <AccountCard title="Quick links">
          <div className="grid sm:grid-cols-3 gap-3">
            {quickLinks.map(({ icon: Icon, label, to }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-slate-700 p-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors"
              >
                <Icon size={18} className="text-brand-500 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </AccountCard>

        {/* FAQs */}
        <AccountCard title="Frequently asked questions">
          <Accordion items={faqs.slice(0, 6)} />
        </AccountCard>

        {/* Still need help */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-800 dark:to-slate-800 border border-brand-100/60 dark:border-slate-700 p-6 text-center">
          <FiMessageCircle className="mx-auto text-brand-500" size={28} />
          <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
            Still need a hand?
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Our team replies within 24 hours. We're happy to help with anything.
          </p>
          <Button to="/contact" className="mt-4">
            Contact Support
          </Button>
        </div>
      </div>
    </AccountLayout>
  );
}
