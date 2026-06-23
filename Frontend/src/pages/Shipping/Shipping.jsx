import ShippingHero from "./Components/ShippingHero";
import ShippingHighlights from "./Components/ShippingHighlights";
import DeliveryTimeline from "./Components/DeliveryTimeline";
import ShippingRates from "./Components/ShippingRates";
import ReturnsRefunds from "./Components/ReturnsRefunds";
import Seo from "../../components/common/Seo";

export default function Shipping() {
  return (
    <>
      <Seo
        title="Shipping & Returns"
        url="https://mohanmaya.com/shipping"
        description="MohanMaya shipping rates, delivery timelines, and our returns & refunds policy."
      />
      <ShippingHero />
      <ShippingHighlights />
      <DeliveryTimeline />
      <ShippingRates />
      <ReturnsRefunds />
    </>
  );
}
