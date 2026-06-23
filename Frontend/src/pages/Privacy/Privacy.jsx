import PrivacyHero from "./Components/PrivacyHero";
import PrivacyCoreSections from "./Components/PrivacyCoreSections";
import PrivacyRights from "./Components/PrivacyRights";
import PrivacyFaq from "./Components/PrivacyFaq";
import Seo from "../../components/common/Seo";

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        url="https://mohanmaya.com/privacy"
        description="How MohanMaya collects, uses and protects your personal data."
      />
      <PrivacyHero />
      <PrivacyCoreSections />
      <PrivacyRights />
      <PrivacyFaq />
    </>
  );
}
