import { Outlet } from "react-router";
import Header from "../components/website/Header";
import Footer from "../components/website/Footer";
import { LoginGateProvider } from "../context/LoginGateContext";
import {
  RouteScrollReset,
  ScrollToTopButton,
} from "../components/common/ScrollToTop";

// LoginGateProvider lives here (inside the router) so its login modal can use
// react-router's <Link>/navigation, while still sitting inside the Auth/Cart
// providers from main.jsx. It wraps every page rendered through <Outlet>.
const WebsiteLayout = () => {
  return (
    <LoginGateProvider>
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
    </LoginGateProvider>
  );
};

export default WebsiteLayout;
