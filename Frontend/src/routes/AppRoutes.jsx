import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import WebsiteLayout from "../layouts/WebsiteLayout";
import RouteFallback from "../components/common/RouteFallback";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Eager: the landing page is the most common entry point.
import Home from "../pages/Home/Home";

// Lazy-loaded routes → each becomes its own chunk (code splitting).
const Shop = lazy(() => import("../pages/Shop/Shop"));
const ProductDetails = lazy(() => import("../pages/ProductDetails/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Wishlist = lazy(() => import("../pages/Wishlist/Wishlist"));
const Checkout = lazy(() => import("../pages/Checkout/Checkout"));
const TrackOrder = lazy(() => import("../pages/TrackOrder/TrackOrder"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const FAQ = lazy(() => import("../pages/FAQ/FAQ"));
const Privacy = lazy(() => import("../pages/Privacy/Privacy"));
const Terms = lazy(() => import("../pages/Terms/Terms"));
const Shipping = lazy(() => import("../pages/Shipping/Shipping"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/Signup"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const Community = lazy(() => import("../pages/Community/Community"));

// Authenticated account section.
const Profile = lazy(() => import("../pages/Account/Profile"));
const Orders = lazy(() => import("../pages/Account/Orders"));
const Addresses = lazy(() => import("../pages/Account/Addresses"));
const Notifications = lazy(() => import("../pages/Account/Notifications"));
const Settings = lazy(() => import("../pages/Account/Settings"));
const Help = lazy(() => import("../pages/Account/Help"));

const withSuspense = (Component) => (
  <Suspense fallback={<RouteFallback />}>
    <Component />
  </Suspense>
);

// Account routes require an authenticated session - guests are bounced to
// /login (and returned here afterwards).
const protectedRoute = (Component) => (
  <ProtectedRoute>{withSuspense(Component)}</ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebsiteLayout />,
    errorElement: <RouteFallback error />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: withSuspense(Shop) },
      { path: "product/:slug", element: withSuspense(ProductDetails) },
      { path: "cart", element: withSuspense(Cart) },
      { path: "wishlist", element: withSuspense(Wishlist) },
      { path: "checkout", element: withSuspense(Checkout) },
      { path: "track-order", element: withSuspense(TrackOrder) },
      { path: "about", element: withSuspense(About) },
      { path: "contact", element: withSuspense(Contact) },
      { path: "faq", element: withSuspense(FAQ) },
      { path: "privacy", element: withSuspense(Privacy) },
      { path: "terms", element: withSuspense(Terms) },
      { path: "shipping", element: withSuspense(Shipping) },
      { path: "login", element: withSuspense(Login) },
      { path: "signup", element: withSuspense(Signup) },
      { path: "forgot-password", element: withSuspense(ForgotPassword) },
      { path: "community", element: withSuspense(Community) },

      // Account section (auth-guarded)
      { path: "account", element: protectedRoute(Profile) },
      { path: "orders", element: protectedRoute(Orders) },
      { path: "addresses", element: protectedRoute(Addresses) },
      { path: "notifications", element: protectedRoute(Notifications) },
      { path: "settings", element: protectedRoute(Settings) },
      { path: "help", element: protectedRoute(Help) },

      { path: "*", element: withSuspense(NotFound) },
    ],
  },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
