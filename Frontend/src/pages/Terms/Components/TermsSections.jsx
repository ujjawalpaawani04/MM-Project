import { motion } from "framer-motion";
import { fadeUp } from "../../../utils/motion";
import Card from "../../../components/common/Card";

export default function TermsSections({ sections }) {
  return (
    <>
      {sections.map((s, i) => (
        <motion.div
          key={s.id}
          id={s.id}
          {...fadeUp}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="scroll-mt-24"
        >
          <Card className="p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white text-xl">
                {s.icon}
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {s.heading}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {s.body}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </>
  );
}
