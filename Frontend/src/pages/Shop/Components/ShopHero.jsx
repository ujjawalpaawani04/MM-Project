import PageHero from "../../../components/common/PageHero";

export default function ShopHero() {
  return (
    <PageHero
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shop" }]}
      eyebrow="The Collection"
      title="Find Your Next "
      highlight="Treasure"
      description="Browse the full Mohan-Maya collection - hand-painted figures, limited editions, and gift-ready keepsakes. Filter by character, occasion, or price."
      image="/website/images/heroBg.webp"
    />
  );
}
