import PageHero from "../../../components/common/PageHero";

export default function CartHero() {
  return (
    <PageHero
     image="/website/images/heroBg.webp"
      compact
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
      eyebrow="Your Bag"
      title="Shopping"
      highlight="Cart"
      description="Review your selected miniatures before checkout."
    />
  );
}
