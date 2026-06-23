import { motion } from "framer-motion";
import { FiUserCheck, FiCheck } from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionDivider from "../../../components/common/SectionDivider";
import { fadeUp } from "../../../utils/motion";

const rights = [
  "Request access to the personal data we hold about you",
  "Ask us to correct any inaccurate information",
  "Request deletion of your personal data at any time",
  "Opt out of marketing communications whenever you wish",
];

/** Gradient "Your Rights" highlight card. */
export default function PrivacyRights() {
  return (
    <>
      <div className="bg-cream-100 dark:bg-slate-900 pt-14 lg:pt-20">
        <SectionDivider />
      </div>

      <section className="bg-cream-100 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <motion.div {...fadeUp}>
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 bg-gradient-to-br from-pink-500 to-rose-400 p-8 sm:p-10 text-white flex flex-col justify-center">
                  <FiUserCheck className="text-3xl" />
                  <h3 className="mt-4 text-xl font-bold">Your Rights</h3>
                  <p className="mt-2 text-sm text-white/90 leading-relaxed">
                    You stay in control of your personal data — always.
                  </p>
                </div>
                <div className="md:col-span-3 p-8 sm:p-10">
                  <ul className="space-y-4">
                    {rights.map((r) => (
                      <li key={r} className="flex items-start gap-3">
                        <span className="shrink-0 mt-0.5 grid place-items-center h-6 w-6 rounded-full bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300">
                          <FiCheck className="text-sm" />
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}
