import { Outlet } from "react-router";
import Header from "../components/website/Header";
import Footer from "../components/website/Footer";
import {
  RouteScrollReset,
  ScrollToTopButton,
} from "../components/common/ScrollToTop";

const WebsiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-900">
      <RouteScrollReset />
      <Header />
      {/* Offset for the fixed header on xl screens */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default WebsiteLayout;
