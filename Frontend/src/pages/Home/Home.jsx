import { useState } from "react";
import HomeHero from "./Components/HomeHero";
import MostLoved from "./Components/MostLoved";
import BestSellers from "./Components/BestSellers";
import NewArrivals from "./Components/NewArrivals";
import Testimonial from "./Components/Testimonial";
import WhyChooseUs from "./Components/WhyChooseUs";
import Newsletter from "./Components/Newsletter";
// import TrustBadges from "./Components/TrustBadges";
import ProductQuickView from "../../components/website/ProductQuickView";
import Collections from "./Components/Collections";
import Seo from "../../components/common/Seo";

const Home = () => {
  const [quickView, setQuickView] = useState(null);

  return (
    <>
      <Seo
        url="https://mohanmaya.com/"
        description="Discover MohanMaya's handcrafted miniature art — Krishna, Radha & devotional figurines made with love and timeless tradition. Free shipping over ₹1999."
      />
      <HomeHero />
      <MostLoved />
      <BestSellers onQuickView={setQuickView} />
      <NewArrivals />
          <Collections />
      <Testimonial />
  
      <WhyChooseUs />
      <Newsletter />
      {/* <TrustBadges /> */}

      <ProductQuickView
        product={quickView}
        isOpen={!!quickView}
        onClose={() => setQuickView(null)}
      />
    </>
  );
};

export default Home;
