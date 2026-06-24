import ContactHero from "./Components/ContactHero";
import ContactForm from "./Components/ContactForm";
import FaqPreview from "./Components/FaqPreview";
import LocationMap from "./Components/LocationMap";
import Seo from "../../components/common/Seo";

const Contact = () => {
  return (
    <>
      <Seo
        title="Contact Us"
        url="https://mohanmaya.com/contact"
        description="Get in touch with the MohanMaya team - questions, custom orders and support. We reply Mon–Sat, 10am–7pm."
      />
      <ContactHero />
      <ContactForm />
      <FaqPreview />
      <LocationMap />
    </>
  );
};

export default Contact;
