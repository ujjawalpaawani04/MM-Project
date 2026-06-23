import PageHero from "../../../components/common/PageHero";

export default function WishlistHero() {
  return (
    <PageHero
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      eyebrow="Saved For Later"
      title="My"
      highlight="Wishlist"
      description="The pieces you've saved to revisit and collect."
            image="/website/images/heroBg.webp"
    />
  );
}
