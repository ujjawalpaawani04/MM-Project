import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiLogOut } from "react-icons/fi";
import { FaBarsStaggered } from "react-icons/fa6";
import MobileSidebar from "./MobileSidebar";
import ThemeToggle from "../common/ThemeToggle";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useFlyToCart } from "../../context/FlyToCartContext";


import logo from "../../assets/website/mmLogo.png";

/**
 * Header wishlist heart. No counter - instead the icon itself reflects state:
 * empty wishlist shows a muted outline, a non-empty wishlist shows a solid red
 * heart. Each transition springs (scale pop) and carries a soft glow that fades
 * in/out, so adding the first item feels celebratory and clearing it settles
 * back gracefully. `lucide`'s Heart is used (not Feather) because it fills.
 */
function WishlistHeart({ count }) {
  const active = count > 0;
  const controls = useAnimationControls();
  const prevCount = useRef(count);

  useEffect(() => {
    // Spring pop only when an item is ADDED (count goes up); clearing the
    // wishlist just lets the fill/glow fade out via the CSS color transition.
    if (count > prevCount.current) {
      controls.start({
        scale: [1, 1.4, 0.94, 1.08, 1],
        transition: { duration: 0.55, ease: "easeOut" },
      });
    }
    prevCount.current = count;
  }, [count, controls]);

  return (
    <Link
      to="/wishlist"
      className="relative p-1.5 text-gray-800 dark:text-gray-100 hover:text-brand-500 transition-colors"
      aria-label={active ? "Wishlist, has items" : "Wishlist, empty"}
    >
      <motion.span className="block" animate={controls}>
        <Heart
          size={22}
          className={`transition-all duration-300 ${
            active
              ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.55)]"
              : "fill-transparent text-gray-800 dark:text-gray-100 drop-shadow-none"
          }`}
        />
      </motion.span>
    </Link>
  );
}

// Sparkle burst played over the cart icon when an item "lands". Re-mounted via
// a changing `key` so each arrival replays it; purely decorative.
const SPARKS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 6;
  return { id: i, x: Math.cos(angle) * 18, y: Math.sin(angle) * 18 };
});

function CartSparkle() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* Soft glow ring */}
      <motion.span
        initial={{ scale: 0.3, opacity: 0.5 }}
        animate={{ scale: 2.1, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 blur-[2px]"
      />
      {/* Radiating sparkles */}
      {SPARKS.map((s) => (
        <motion.span
          key={s.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: s.x, y: s.y, scale: 0, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute h-1.5 w-1.5 rounded-full bg-brand-400"
        />
      ))}
    </span>
  );
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Community", path: "/community" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const { registerCartTarget, subscribeArrive } = useFlyToCart();

  // Cart-arrival reactions: bag bounce, badge pop, sparkle burst.
  const reduceMotion = useReducedMotion();
  const bagControls = useAnimationControls();
  const badgeControls = useAnimationControls();
  const [burstId, setBurstId] = useState(0);

  useEffect(
    () =>
      subscribeArrive(() => {
        setBurstId((n) => n + 1);
        if (reduceMotion) return;
        // Subtle, springy bounce/pop — restrained for a premium feel.
        bagControls.start({
          scale: [1, 1.18, 0.96, 1.05, 1],
          transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
        });
        badgeControls.start({
          scale: [1, 1.4, 1],
          transition: { duration: 0.4, ease: "easeOut" },
        });
      }),
    [subscribeArrive, bagControls, badgeControls, reduceMotion]
  );

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    toast.success("You've been signed out.");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <header className="container  mx-auto border  border-brand-300 dark:border-slate-700 bg-ink-50 dark:bg-slate-900 xl:fixed top-5 left-1/2 xl:-translate-x-1/2 xl:rounded-full z-[999]  theme-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-brand-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Mohan Maya home">
            <img
              src={logo}
              alt="Mohan Maya logo"
              className="w-15 h-15 object-contain rounded-full"
            />
            <span className="hidden sm:block font-bold text-2xl text-gray-900 dark:text-white">
              Mohan<span className="text-brand-500">Maya</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `text-[18px] font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-brand-500"
                      : "text-gray-800 dark:text-gray-200 hover:text-brand-500"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="hidden md:flex items-center overflow-hidden border border-gray-300 dark:border-slate-600 rounded-full h-10 bg-white dark:bg-slate-800"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search miniatures..."
                aria-label="Search products"
                className="w-40 lg:w-48 px-4 outline-none text-sm bg-transparent text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                aria-label="Search"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white rounded-full"
              >
                <FiSearch />
              </button>
            </form>

            <ThemeToggle />

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-1.5 p-1.5 text-gray-800 dark:text-gray-100 hover:text-brand-500 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label="Account menu"
                >
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold uppercase">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </button>
                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[998]"
                      onClick={() => setAccountOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl py-2 z-[999]"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                      </div>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                        role="menuitem"
                      >
                        <FiHeart size={16} /> My Wishlist
                      </Link>
                      <Link
                        to="/track-order"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                        role="menuitem"
                      >
                        <FiShoppingBag size={16} /> Track Order
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                        role="menuitem"
                      >
                        <FiLogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1.5 text-gray-800 dark:text-gray-100 hover:text-brand-500 transition-colors"
                aria-label="Sign in"
              >
                <FiUser className="text-[22px]" />
              </Link>
            )}

            {/* Wishlist - heart fills red when the wishlist has items (no count) */}
            <WishlistHeart count={wishlistCount} />

            {/* Cart */}
            <Link
              ref={registerCartTarget}
              to="/cart"
              className="relative p-1.5 text-gray-800 dark:text-gray-100 hover:text-brand-500 transition-colors"
              aria-label={`View cart, ${totalItems} items`}
            >
              <motion.span className="block" animate={bagControls}>
                <FiShoppingBag className="text-[22px]" />
              </motion.span>
              {totalItems > 0 && (
                <motion.span
                  animate={badgeControls}
                  className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
              {/* Sparkle burst on arrival (skipped under reduced motion) */}
              {!reduceMotion && burstId > 0 && <CartSparkle key={burstId} />}
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors lg:hidden text-gray-800 dark:text-gray-100"
              aria-label="Open menu"
            >
              <FaBarsStaggered className="text-[22px]" />
            </button>
          </div>
        </div>
      </div>

      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
