import NotFoundHero from "./Components/NotFoundHero";
import Seo from "../../components/common/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" noindex />
      <NotFoundHero />
    </>
  );
}
