import { motion } from "framer-motion";
import { fadeUp } from "../../../utils/motion";
import Accordion from "../../../components/common/Accordion";
import SectionDivider from "../../../components/common/SectionDivider";
import TermsContact from "./TermsContact";

export default function TermsClauses({ detailedClauses }) {
  return (
    <>
      <div className="py-4">
        <SectionDivider />
      </div>

      {/* Detailed clauses accordion */}
      <motion.div {...fadeUp}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
          Detailed clauses
        </h3>
        <Accordion items={detailedClauses} />
      </motion.div>

      {/* Contact callout + Last updated */}
      <TermsContact />
    </>
  );
}
