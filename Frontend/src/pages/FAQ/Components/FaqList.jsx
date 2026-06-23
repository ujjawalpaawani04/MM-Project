import Accordion from "../../../components/common/Accordion";
import Button from "../../../components/common/Button";
import { faqs } from "../../../data/faqs";

/** Accordion of FAQs plus a "still have questions?" contact CTA. */
export default function FaqList() {
  return (
    <section className="bg-cream dark:bg-ink-900 py-16">
      <div className="max-w-3xl mx-auto px-5">
        <Accordion items={faqs} />
        <div className="text-center mt-10">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Still have questions? We're happy to help.
          </p>
          <Button to="/contact" variant="primary">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
