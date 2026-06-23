import {
  FiShoppingBag,
  FiPackage,
  FiSend,
  FiNavigation,
  FiCheckCircle,
} from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionIntro from "../../../components/common/SectionIntro";
import Timeline from "../../../components/common/Timeline";

const deliverySteps = [
  { icon: <FiShoppingBag />, title: "Order Placed", description: "We receive & confirm your order." },
  { icon: <FiPackage />, title: "Processing", description: "Carefully packed within 2 days." },
  { icon: <FiSend />, title: "Dispatched", description: "Handed to our courier partner." },
  { icon: <FiNavigation />, title: "In Transit", description: "On its way across India." },
  { icon: <FiCheckCircle />, title: "Delivered", description: "Arrives in 4-7 business days." },
];

/** Step-by-step delivery journey timeline. */
export default function DeliveryTimeline() {
  return (
    <section className="bg-cream-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <SectionIntro
          eyebrow="The Journey"
          title="How your order reaches you"
          description="Track every step from checkout to your hands."
        />

        <Card className="p-8 lg:p-12">
          <Timeline steps={deliverySteps} />
        </Card>
      </div>
    </section>
  );
}
