import Accordion from "../../../components/common/Accordion";

const faqs = [
  {
    q: "Where do I find my Order ID?",
    a: "Your Order ID is in your confirmation email and begins with “MM-”. It also appears on your receipt and in your account orders.",
  },
  {
    q: "How long does delivery take?",
    a: "In-stock pieces are dispatched within 2 business days and delivered in 4-7 business days across India. Pre-order items ship on their listed release date.",
  },
  {
    q: "My tracking hasn't updated - what should I do?",
    a: "Carrier scans can take up to 24 hours to appear. If there's no movement after 48 hours, reach out to our support team and we'll investigate right away.",
  },
  {
    q: "Can I change my delivery address?",
    a: "Address changes are possible while your order is still Processing. Contact support as soon as possible and we'll do our best to update it before dispatch.",
  },
];

export default function TrackFaq() {
  return (
    <section className="bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800 py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            - Need Help? -
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Tracking FAQs
          </h2>
        </div>
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
