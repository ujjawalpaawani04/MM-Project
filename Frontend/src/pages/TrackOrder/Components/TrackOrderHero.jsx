import PageHero from "../../../components/common/PageHero";

export default function TrackOrderHero() {
  return (
    <PageHero
          image="/website/images/heroBg.webp"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Track Order" }]}
      eyebrow="Order Status"
      title="Track Your"
      highlight="Order"
      description="Enter your order details below to follow your handcrafted miniatures in real time - from our studio to your doorstep."
    />
  );
}
