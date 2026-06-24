import { motion } from "framer-motion";
import { FiMail, FiCreditCard } from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionIntro from "../../../components/common/SectionIntro";
import SectionDivider from "../../../components/common/SectionDivider";
import Accordion from "../../../components/common/Accordion";
import { fadeUp } from "../../../utils/motion";

const returnSteps = [
  {
    title: "Email Us",
    text: "Write to support@mohanmaya.com with your order number and reason within 7 days of delivery.",
  },
  {
    title: "We Arrange Pickup",
    text: "Our team schedules a doorstep pickup of the unused item in its original packaging.",
  },
  {
    title: "Quality Check",
    text: "Once received, we inspect the item to ensure it meets return conditions.",
  },
  {
    title: "Refund Processed",
    text: "Your refund is issued within 5-7 business days of approval.",
  },
];

const returnFaqs = [
  {
    q: "What is your return window?",
    a: "Returns are accepted within 7 days of delivery for unused items in their original packaging with all tags intact.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Items damaged in transit are replaced free of charge. Just email us photos at support@mohanmaya.com and we'll arrange a replacement.",
  },
  {
    q: "How long do refunds take?",
    a: "Once we receive and inspect your returned item, refunds are processed within 5-7 business days to your original payment method.",
  },
  {
    q: "Can I exchange an item instead of returning it?",
    a: "Yes. Mention your preferred replacement when you email us, and we'll arrange the exchange subject to availability.",
  },
  {
    q: "Are pre-order items returnable?",
    a: "Pre-order pieces follow the same 7-day return policy once delivered, provided they are unused and in original packaging.",
  },
];

/** Returns & refunds: how-to steps, refund timeline highlight and FAQ. */
export default function ReturnsRefunds() {
  return (
    <>
      <div className="bg-cream-100 dark:bg-slate-900 pt-14 lg:pt-20">
        <SectionDivider />
      </div>

      <section id="returns" className="bg-cream-100 dark:bg-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <SectionIntro
            eyebrow="Returns & Refunds"
            title="Changed your mind? No worries."
            description="Returns are accepted within 7 days of delivery for unused items in their original packaging. Items damaged in transit are replaced free of charge."
          />

          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* How to return - numbered steps */}
            <motion.div {...fadeUp}>
              <Card className="p-7 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  How to return an item
                </h3>
                <ol className="mt-6 space-y-6">
                  {returnSteps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white text-sm font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {s.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {s.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            </motion.div>

            {/* Refund timeline highlight */}
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <Card className="p-7 sm:p-8 h-full flex flex-col">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white text-xl">
                  <FiCreditCard />
                </span>
                <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                  Refund timeline
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Once we receive and approve your returned item, your refund is
                  processed within <strong className="text-brand-500">5-7 business days</strong>{" "}
                  to your original payment method.
                </p>

                <div className="mt-6 rounded-xl bg-brand-50 dark:bg-slate-700/60 p-5">
                  <div className="flex items-center gap-3">
                    <FiMail className="text-brand-500 dark:text-brand-300 text-xl shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Need help with a return?
                      </p>
                      <a
                        href="mailto:support@mohanmaya.com"
                        className="text-sm text-brand-500 dark:text-brand-300 hover:underline"
                      >
                        support@mohanmaya.com
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Return FAQ */}
          <motion.div {...fadeUp} className="mt-14">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Returns &amp; Refunds FAQ
            </h3>
            <div className="max-w-4xl mx-auto">
              <Accordion items={returnFaqs} />
            </div>
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
