import Accordion from "../../../components/common/Accordion";
import Button from "../../../components/common/Button";
import { faqs } from "../../../data/faqs";

export default function FaqPreview() {
  return (
    <section className="dark:bg-ink-900">
<div  className="max-w-[800px] mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Frequently Asked <span className = "text-[#e34786] ">Questions</span> 
        </h2>
        <p className="mt-3  dark:text-gray-300">
          Quick answers to the things people ask most.
        </p>
      </div>
      <Accordion items={faqs.slice(0, 4)} />
      <div className="text-center mt-8">
        <Button to="/faq" variant="outline">
          View all FAQs
        </Button>
      </div>
</div>
    </section>
  );
}
