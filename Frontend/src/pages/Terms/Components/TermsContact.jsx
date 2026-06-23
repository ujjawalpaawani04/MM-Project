import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { fadeUp } from "../../../utils/motion";
import Card from "../../../components/common/Card";

export default function TermsContact() {
  return (
    <>
      <motion.div {...fadeUp}>
        <Card className="p-7 sm:p-8 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <span className="shrink-0 grid place-items-center h-12 w-12 rounded-xl bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300 text-xl">
              <FiMail />
            </span>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white">
                Questions about these terms?
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Get in touch and our team will be glad to clarify.
              </p>
            </div>
            <a
              href="mailto:support@mohanmaya.com"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
            >
              Contact us
            </a>
          </div>
        </Card>
      </motion.div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
        <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
        Last updated: June 2026
      </div>
    </>
  );
}
