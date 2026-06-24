import {
  FiMonitor,
  FiTag,
  FiShoppingCart,
  FiAward,
} from "react-icons/fi";
import SectionIntro from "../../../components/common/SectionIntro";
import TermsTableOfContents from "./TermsTableOfContents";
import TermsSections from "./TermsSections";
import TermsClauses from "./TermsClauses";

const sections = [
  {
    id: "use-of-the-site",
    icon: <FiMonitor />,
    heading: "Use of the Site",
    body: "By accessing Mohan Maya you agree to use the site lawfully and not to misuse any content, imagery or product information presented here. You agree not to attempt to disrupt, copy or exploit the site or its services in any unauthorised way.",
  },
  {
    id: "products-pricing",
    icon: <FiTag />,
    heading: "Products & Pricing",
    body: "We strive for accuracy in product descriptions and prices. Colours may vary slightly due to the hand-painted nature of each piece and your display settings. We reserve the right to update prices and product details at any time without prior notice.",
  },
  {
    id: "orders",
    icon: <FiShoppingCart />,
    heading: "Orders",
    body: "All orders are subject to acceptance and availability. We reserve the right to cancel an order in the rare event of a pricing or stock error, in which case you'll receive a full refund. Order confirmation does not guarantee acceptance until dispatch.",
  },
  {
    id: "intellectual-property",
    icon: <FiAward />,
    heading: "Intellectual Property",
    body: "All characters, designs and content are the property of Mohan Maya and may not be reproduced, distributed or used commercially without our written permission. Unauthorised use of our artwork or branding is strictly prohibited.",
  },
];

const detailedClauses = [
  {
    q: "Limitation of liability",
    a: "Mohan Maya is not liable for any indirect or consequential loss arising from your use of the site. Our total liability for any order is limited to the value of that order.",
  },
  {
    q: "Governing law",
    a: "These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts located in India.",
  },
  {
    q: "Changes to these terms",
    a: "We may update these Terms & Conditions from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    q: "Third-party links",
    a: "Our site may contain links to third-party websites. We are not responsible for the content, privacy practices or availability of those external sites.",
  },
];

export default function TermsContent() {
  return (
    <section className="bg-cream dark:bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <SectionIntro
          eyebrow="Terms & Conditions"
          title="The terms that govern your use of Mohan Maya"
          description="Please read these terms carefully before using our site or placing an order."
        />

        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Sticky table of contents - desktop */}
          <TermsTableOfContents sections={sections} />

          {/* Sections */}
          <div className="space-y-6">
            <TermsSections sections={sections} />

            <TermsClauses detailedClauses={detailedClauses} />
          </div>
        </div>
      </div>
    </section>
  );
}
