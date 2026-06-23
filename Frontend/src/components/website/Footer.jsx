import { Link } from "react-router";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaPhoneAlt,
  FaEnvelope,
  FaRegClock,
} from "react-icons/fa";

import logo from "../../assets/website/mmLogo.png";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/shop" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const support = [
  { label: "Track Order", to: "/track-order" },
  { label: "FAQs", to: "/faq" },
  { label: "Shipping & Delivery", to: "/shipping" },
  // { label: "Returns & Refunds", to: "/shipping" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
];


const socials = [
  { Icon: FaInstagram, url: "https://instagram.com/mohanmaya_", label: "Instagram" },
  { Icon: FaFacebookF, url: "https://www.facebook.com/share/18dgmfQ39U/", label: "Facebook" },
  { Icon: FaYoutube, url: "https://www.youtube.com/results?search_query=mohanmaya", label: "YouTube" },
  // { Icon: FaPinterestP, url: "#", label: "Pinterest" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-900 text-white">
      <div className="container mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
           <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Mohan Maya home">
             <img alt="Mohan Maya logo" className="w-15 h-15 object-contain rounded-full" src={logo} />
             <span className="hidden sm:block font-bold text-2xl text-white">
               Mohan<span className="text-brand-500">Maya</span>
             </span>
           </Link>
            <p className="text-gray-400  leading-6 mb-10 max-w-xs">
              Handcrafted miniature art made with love, inspired by devotion and
              tradition.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[18px] font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 text-[16px] hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-[18px] font-semibold mb-5">Help &amp; Support</h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 text-[16px] hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-[18px] font-semibold mb-5">Customer Service</h3>
            <ul className="space-y-2 text-[16px]">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-brand-500 shrink-0" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-brand-500 shrink-0" />
                <a
                  href="mailto:support@mohanmaya.com"
                  className="text-gray-300 hover:text-white"
                >
                  support@mohanmaya.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaRegClock className="text-brand-500 shrink-0" />
                <span className="text-gray-300">Mon - Sat: 10:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <p className="text-gray-500 text-sm text-center">
            © {year} MohanMaya. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
