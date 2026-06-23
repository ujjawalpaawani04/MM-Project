import PageHero from "../../../components/common/PageHero";

export default function AboutHero() {
  return (
    <PageHero
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      eyebrow="About us"
      title="Where Tiny Creations Tell "
      highlight="Big Stories"
      description="From concept to craftsmanship, every miniature is designed with passion, precision, and attention to the finest details"
      image="/website/images/heroBg.webp"
    />
  );
}
