import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FiX, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Cart", path: "/cart" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    onClose();
  };

  const socialLinks = [
    { icon: FaFacebookF, url: "#" },
    { icon: FaTwitter, url: "#" },
    { icon: FaYoutube, url: "#" },
    { icon: FaLinkedinIn, url: "#" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 lg:hidden ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-linear-to-b from-slate-900 to-slate-800 shadow-2xl transition-transform duration-300 lg:hidden z-50 transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
          <h2 className="text-white text-xl font-bold">
            Mohan<span className="text-brand-400">Maya</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-500 transition-colors duration-300 rounded-full"
          >
            <FiX className="text-2xl text-white" />
          </button>
        </div>

        {/* Search Box - Fixed */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="p-6 border-b border-slate-700 shrink-0"
        >
          <div className="flex items-center overflow-hidden border border-slate-600 rounded-lg h-12 bg-slate-800">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you searching for?"
              aria-label="Search products"
              className="flex-1 px-4 outline-none text-sm bg-slate-800 text-white placeholder-slate-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="px-3 py-2 text-slate-400 hover:text-brand-400 transition-colors"
            >
              <FiSearch className="text-lg" />
            </button>
          </div>
        </form>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          {/* Navigation Links */}
          <nav className="p-6 border-b border-slate-700 xl:hidden">
            <div className="space-y-3">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-amber-500 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Account */}
          <div className="p-6 border-b border-slate-700">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-linear-to-r from-pink-500 to-rose-400 text-white font-semibold uppercase">
                    {user.name?.charAt(0) || "U"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="font-semibold truncate">{user.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-pink-500 to-rose-400 text-white font-medium"
                >
                  <FiUser /> Login
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="flex items-center justify-center px-4 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-white font-semibold mb-4 text-[22px]">
              Contact Info
            </h3>
            <div className="space-y-3 text-white flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-block mt-1 p-2.5 rounded-full shadow-[0px_1px_4px_rgba(255,255,255,0.22)]">
                  <FaLocationDot />
                </span>
                <p>12/A, Miranda City Tower, NYC</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block p-2.5 rounded-full shadow-[0px_1px_4px_rgba(255,255,255,0.22)]">
                  <FaPhone />
                </span>
                <a
                  href="tel:+08888979769"
                  className="hover:text-amber-500 transition-colors"
                >
                  +08888979697
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block p-2.5 rounded-full shadow-[0px_1px_4px_rgba(255,255,255,0.22)]">
                  <CgMail />
                </span>
                <a
                  href="mailto:support@mail.com"
                  className="hover:text-amber-500 transition-colors"
                >
                  support@mail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    <Icon className="text-lg" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
