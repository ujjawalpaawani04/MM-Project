import {
  FiUser,
  FiPackage,
  FiHeart,
  FiShoppingCart,
  FiMapPin,
  FiTruck,
  FiBell,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

/**
 * Single source of truth for the authenticated account navigation.
 *
 * Reused by the desktop account dropdown (grouped with dividers), the account
 * page sidebar (flat list) and the mobile drawer - so every surface stays in
 * sync. Each item: { label, to, icon, description }.
 */
export const ACCOUNT_NAV_GROUPS = [
  [
    { label: "My Profile", to: "/account", icon: FiUser, description: "Personal details" },
    { label: "My Orders", to: "/orders", icon: FiPackage, description: "Track & history" },
    { label: "Saved Addresses", to: "/addresses", icon: FiMapPin, description: "Delivery locations" },
  ],
  [
    { label: "Wishlist", to: "/wishlist", icon: FiHeart, description: "Saved items" },
    { label: "Cart", to: "/cart", icon: FiShoppingCart, description: "Ready to checkout" },
    { label: "Track Order", to: "/track-order", icon: FiTruck, description: "Where's my order" },
  ],
  [
    { label: "Notifications", to: "/notifications", icon: FiBell, description: "Updates & alerts" },
    { label: "Settings", to: "/settings", icon: FiSettings, description: "Preferences" },
    { label: "Help & Support", to: "/help", icon: FiHelpCircle, description: "We're here to help" },
  ],
];

/** Flattened list (sidebar / mobile). */
export const ACCOUNT_NAV = ACCOUNT_NAV_GROUPS.flat();
