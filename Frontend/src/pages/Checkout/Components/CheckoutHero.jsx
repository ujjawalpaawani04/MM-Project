import PageHero from "../../../components/common/PageHero";

export default function CheckoutHero() {
  return (
    <PageHero
    image="/website/images/heroBg.webp"
      compact
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Cart", to: "/cart" },
        { label: "Checkout" },
      ]}
      eyebrow="Secure Checkout"
      title="Secure"
      highlight="Checkout"
      description="Just a few details and your collectibles are on their way."
    />
  );
}
