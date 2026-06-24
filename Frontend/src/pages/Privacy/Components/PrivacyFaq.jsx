import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionIntro from "../../../components/common/SectionIntro";
import SectionDivider from "../../../components/common/SectionDivider";
import Accordion from "../../../components/common/Accordion";
import { fadeUp } from "../../../utils/motion";

const privacyFaqs = [
  {
    q: "Do you sell my personal data?",
    a: "Never. We do not sell, rent or trade your personal data with any third party. Your details are used only to fulfil your order and provide support.",
  },
  {
    q: "Where is my cart and wishlist stored?",
    a: "Your cart, wishlist and theme preference are stored only in your own browser's local storage - they never leave your device unless you place an order.",
  },
  {
    q: "How can I delete my data?",
    a: "Simply email support@mohanmaya.com requesting deletion and we'll remove any personal data associated with your orders.",
  },
  {
    q: "Do you use advertising trackers?",
    a: "No. We do not use third-party advertising trackers or cross-site cookies on this site.",
  },
];

/** Privacy FAQ accordion, contact callout and last-updated footer. */
export default function PrivacyFaq() {
  return (
    <>
      <div className="bg-cream dark:bg-ink-900 pt-14 lg:pt-20">
        <SectionDivider />
      </div>

      <section className="bg-cream dark:bg-ink-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <SectionIntro
            title="Privacy FAQ"
            description="Quick answers to the questions we hear most."
            className="max-w-none mb-10"
          />

          <motion.div {...fadeUp}>
            <Accordion items={privacyFaqs} />
          </motion.div>

          {/* Contact callout */}
          <motion.div {...fadeUp} className="mt-12">
            <Card className="p-7 sm:p-8 text-center">
              <span className="inline-grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white text-xl">
                <FiMail />
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                Questions about your privacy?
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Reach out any time - we're happy to help.
              </p>
              <a
                href="mailto:support@mohanmaya.com"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
              >
                <FiMail /> support@mohanmaya.com
              </a>
            </Card>
          </motion.div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            Last updated: June 2026
          </div>
        </div>
      </section>
    </>
  );
}
