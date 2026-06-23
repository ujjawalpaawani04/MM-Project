import PageHero from "../../../components/common/PageHero";

export default function ContactHero() {
 
  return (
    <PageHero
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      eyebrow="Contact us"
      title="Let's Build Your "
      highlight="Collection"
      description="Whether you're looking for a rare collectible, a custom miniature, or order support, our team is ready to assist you."
      image="/website/images/heroBg.webp"
    />
  );
}
