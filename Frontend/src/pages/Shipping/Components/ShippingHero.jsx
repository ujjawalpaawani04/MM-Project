import PageHero from "../../../components/common/PageHero";

export default function ShippingHero() {
  return (
    <PageHero
          image="/website/images/heroBg.webp"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shipping & Returns" }]}
      eyebrow="Legal"
      title="Shipping &"
      highlight="Returns"
      description="Delivery timelines and our hassle-free returns process."
    />
  );
}
