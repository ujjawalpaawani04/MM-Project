import PageHero from "../../../components/common/PageHero";

export default function AboutHero() {
  return (
    <PageHero
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      eyebrow="Our Story"
      title="The Hands Behind "
      highlight="the Story"
      description="Mohan Maya began with one wish - to let you hold a story in your hands. Meet the artisans, the craft, and the devotion behind every piece."
      image="/website/images/heroBg.webp"
    />
  );
}
