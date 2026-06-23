import PageHero from "../../../components/common/PageHero";

export default function TermsHero() {
  return (
    <PageHero
          image="/website/images/heroBg.webp"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Terms" }]}
      eyebrow="Legal"
      title="Terms &"
      highlight="Conditions"
      description="The terms that govern your use of Mohan Maya."
    />
  );
}
