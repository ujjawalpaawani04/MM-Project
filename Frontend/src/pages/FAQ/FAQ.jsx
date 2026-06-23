import FaqHero from "./Components/FaqHero";
import FaqList from "./Components/FaqList";
import Seo from "../../components/common/Seo";

export default function FAQ() {
  return (
    <>
      <Seo
        title="FAQ"
        url="https://mohanmaya.com/faq"
        description="Answers to common questions about MohanMaya orders, shipping, returns and product care."
      />
      <FaqHero />
      <FaqList />
    </>
  );
}
