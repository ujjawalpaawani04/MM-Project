import PageHero from "../../../components/common/PageHero";

export default function PrivacyHero() {
  return (
    <PageHero
          image="/website/images/heroBg.webp"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]}
      eyebrow="Legal"
      title="Privacy"
      highlight="Policy"
      description="How we collect, use and protect your information - in plain language."
    />
  );
}
