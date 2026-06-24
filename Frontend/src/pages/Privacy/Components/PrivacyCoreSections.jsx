import { motion } from "framer-motion";
import { FiDatabase, FiSettings, FiServer, FiShield } from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionIntro from "../../../components/common/SectionIntro";
import { fadeUp } from "../../../utils/motion";

const sections = [
  {
    icon: <FiDatabase />,
    heading: "Information We Collect",
    body: "We collect the details you provide at checkout - your name, contact details and shipping address - solely to fulfil your order. This demo store keeps cart and wishlist data only in your own browser's local storage, never on a remote server.",
  },
  {
    icon: <FiSettings />,
    heading: "How We Use Your Data",
    body: "Your information is used to process orders, provide support and, if you opt in, send occasional updates about new collections. We never sell, rent or trade your personal data with third parties.",
  },
  {
    icon: <FiServer />,
    heading: "Cookies & Storage",
    body: "We use local storage to remember your cart, wishlist and theme preference so your experience stays seamless. No third-party advertising trackers or cross-site cookies are used on this site.",
  },
  {
    icon: <FiShield />,
    heading: "Data Security",
    body: "We apply industry-standard safeguards to protect any information you share with us. Because cart and wishlist data live only in your browser, that information never leaves your device unless you place an order.",
  },
];

/** Privacy intro + numbered core policy card grid. */
export default function PrivacyCoreSections() {
  return (
    <section className="bg-cream dark:bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <SectionIntro
          eyebrow="Privacy Policy"
          title="Your privacy, in plain language"
          description="We believe trust is earned through transparency. Here's exactly how we collect, use and protect your information."
        />

        <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
          {sections.map((s, i) => (
            <motion.div
              key={s.heading}
              {...fadeUp}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card className="h-full p-7">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 grid place-items-center h-11 w-11 rounded-xl bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300 text-xl">
                    {s.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {s.heading}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
