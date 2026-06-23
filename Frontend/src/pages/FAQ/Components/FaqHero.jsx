import PageHero from "../../../components/common/PageHero";

export default function FaqHero() {
  return (
    <PageHero
          image="/website/images/heroBg.webp"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      eyebrow="Help Center"
      title="Frequently Asked"
      highlight="Questions"
      description="Everything you need to know about our miniatures, shipping and returns."
    
    />
  );
}
