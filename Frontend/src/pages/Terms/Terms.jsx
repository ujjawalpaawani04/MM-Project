import TermsHero from "./Components/TermsHero";
import TermsContent from "./Components/TermsContent";
import Seo from "../../components/common/Seo";

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        url="https://mohanmaya.com/terms"
        description="The terms and conditions governing your use of MohanMaya and your purchases."
      />
      <TermsHero />
      <TermsContent />
    </>
  );
}
