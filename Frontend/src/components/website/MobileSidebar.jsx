import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FiX, FiSearch, FiUser, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { ACCOUNT_NAV } from "./accountNav";

import logo from "../../assets/website/mmLogo.png";

// Primary navigation mirrors the desktop header exactly so the drawer reads as a
// responsive extension of it rather than a separate menu.
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Community", path: "/community" },
];

const socialLinks = [
  {
    icon: FaFacebookF,
    url: "https://www.facebook.com/share/18dgmfQ39U/",
    label: "Facebook",
  },
  {
    icon: FaInstagram,
    url: "https://instagram.com/mohanmaya_",
    label: "Instagram",
  },
  {
    icon: FaYoutube,
    url: "https://www.youtube.com/results?search_query=mohanmaya",
    label: "YouTube",
  },
];

// Slide/stagger variants. The app is wrapped in <MotionConfig reducedMotion="user">,
// so Framer collapses these to instant transitions when the OS prefers reduced motion.
const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 360, damping: 38, mass: 0.9 },
  },
  exit: { x: "100%", transition: { duration: 0.25, ease: "easeInOut" } },
};

const listVariants = {
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Lock background scroll while the drawer is open (premium, touch-friendly).
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape for accessibility/keyboard parity with the desktop dropdowns.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    onClose();
  };

  const wishlistActive = wishlistCount > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          {/* Semi-transparent, blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer panel — same surfaces, border and brand as the desktop header */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-[1001] flex h-full w-[88%] max-w-sm flex-col rounded-none border-l border-brand-300 bg-ink-50 shadow-2xl theme-surface dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Header: logo + brand lockup, matching the desktop header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-brand-200/70 px-5 py-4 dark:border-slate-700">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2"
                aria-label="Mohan Maya home"
              >
                <img
                  src={logo}
                  alt="Mohan Maya logo"
                  className="h-11 w-11 rounded-full object-contain"
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Mohan<span className="text-brand-500">Maya</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-full p-2 text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-500 dark:text-gray-200 dark:hover:bg-slate-800"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Search — rounded-full pill with the gradient submit, like the desktop */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="shrink-0 px-5 pb-4 pt-4"
            >
              <div className="flex h-11 items-center overflow-hidden rounded-full border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search miniatures..."
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white"
                >
                  <FiSearch />
                </button>
              </div>
            </form>

            {/* Scrollable content */}
            <div className="scrollbar-thin flex-1 overflow-y-auto px-5 pb-6">
              {/* Primary navigation */}
              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                aria-label="Primary"
                className="space-y-1.5"
              >
                {navLinks.map((item) => (
                  <motion.div key={item.path} variants={itemVariants}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-[17px] font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-brand-50 text-brand-500 dark:bg-brand-500/15"
                            : "text-gray-800 hover:bg-brand-50/60 hover:text-brand-500 dark:text-gray-200 dark:hover:bg-slate-800 dark:hover:text-brand-400"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Quick actions: theme + wishlist + cart, mirroring the desktop right cluster */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-5 flex items-center gap-2.5"
              >
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  aria-label={wishlistActive ? "Wishlist, has items" : "Wishlist, empty"}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:border-brand-400/60"
                >
                  <Heart
                    size={18}
                    className={
                      wishlistActive
                        ? "fill-red-500 text-red-500"
                        : "fill-transparent text-current"
                    }
                  />
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  aria-label={`View cart, ${totalItems} items`}
                  className="relative flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:border-brand-400/60"
                >
                  <FiShoppingBag size={18} />
                  Cart
                  {totalItems > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Account */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 border-t border-brand-200/70 pt-6 dark:border-slate-700"
              >
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-base font-semibold uppercase text-white">
                        {user.name?.charAt(0) || "U"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Account links (parity with the desktop dropdown) */}
                    <div className="grid grid-cols-2 gap-2">
                      {ACCOUNT_NAV.map(({ label, to, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={onClose}
                          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:border-brand-400/60"
                        >
                          <Icon size={16} className="shrink-0" />
                          <span className="truncate">{label}</span>
                        </Link>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:border-red-300 hover:text-red-500 dark:border-slate-600 dark:text-gray-200 dark:hover:border-red-500/50"
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-4 py-3 font-medium text-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <FiUser /> Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={onClose}
                      className="flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-slate-600 dark:text-gray-200 dark:hover:border-brand-400/60"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Contact info */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 border-t border-brand-200/70 pt-6 dark:border-slate-700"
              >
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Contact Info
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-slate-800">
                      <FaLocationDot />
                    </span>
                    <p>12/A, Miranda City Tower, NYC</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-slate-800">
                      <FaPhone />
                    </span>
                    <a
                      href="tel:+08888979769"
                      className="transition-colors hover:text-brand-500"
                    >
                      +08888979697
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-slate-800">
                      <CgMail />
                    </span>
                    <a
                      href="mailto:support@mail.com"
                      className="transition-colors hover:text-brand-500"
                    >
                      support@mail.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 border-t border-brand-200/70 pt-6 dark:border-slate-700"
              >
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white dark:bg-slate-800 dark:text-gray-200 dark:hover:text-white"
                      >
                        <Icon className="text-lg" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
