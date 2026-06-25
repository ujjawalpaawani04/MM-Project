import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

/**
 * Per-platform design tokens that drive the Community page's dynamic theming.
 *
 * Switching tabs swaps the entire visual environment — page background, accent
 * colour, gradients, surfaces, chips, buttons and floating glow blobs — so each
 * tab feels like stepping into a different social platform while staying one
 * coherent design system.
 *
 * `bg-gradient-to-*` is used (rather than the v4 `bg-linear-*` alias) to match
 * the gradient utilities used across the rest of the codebase.
 */
export const PLATFORM_THEMES = {
  youtube: {
    id: "youtube",
    name: "YouTube",
    handle: "@mohanmaya",
    Icon: FaYoutube,
    accent: "#FF0033",
    isDark: false,
    tagline: "Watch the story come to life",
    cta: "Subscribe",
    highlights: ["Devotional shorts", "Workshop diaries", "New-drop reveals"],
    // Clean YouTube-inspired light surface: soft white falling to a faint grey,
    // lifted by the gentlest red wash at the top so the tab still reads "YouTube"
    // without the heavy dark studio look.
    pageBg: "bg-gradient-to-b from-white via-gray-50 to-white",
    overlay:
      "bg-[radial-gradient(60%_45%_at_50%_-5%,rgba(255,0,51,0.06),transparent_70%)]",
    // Text + surface tokens that read correctly on this light background
    text: "text-gray-900",
    textMuted: "text-gray-500",
    heading: "text-gray-900",
    surface: "border border-gray-200 bg-white",
    chip: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100",
    gradient: "from-red-600 to-red-500",
    gradientHover: "hover:from-red-500 hover:to-red-400",
    glow: "shadow-[0_28px_70px_-30px_rgba(255,0,51,0.28)]",
    tabActive: "from-red-600 to-red-500",
    blobs: [
      "h-72 w-72 left-[-6%] top-[-8%] bg-red-200/40",
      "h-80 w-80 right-[-8%] bottom-[-10%] bg-rose-200/40",
    ],
  },

  instagram: {
    id: "instagram",
    name: "Instagram",
    handle: "@mohanmaya",
    Icon: FaInstagram,
    accent: "#E1306C",
    isDark: false,
    tagline: "Every hand-painted detail, up close",
    cta: "Follow",
    highlights: ["Detail reels", "Daily moments", "Behind the brush"],
    pageBg: "bg-gradient-to-br from-rose-50 via-fuchsia-50 to-amber-50",
    overlay:
      "bg-[radial-gradient(50%_40%_at_85%_0%,rgba(225,48,108,0.14),transparent_70%)]",
    text: "text-gray-900",
    textMuted: "text-gray-500",
    heading: "text-gray-900",
    surface: "border border-white/70 bg-white/80 backdrop-blur-xl",
    chip: "bg-white/90 text-pink-600 ring-1 ring-inset ring-pink-200",
    gradient: "from-amber-500 via-pink-500 to-purple-600",
    gradientHover: "hover:opacity-90",
    glow: "shadow-[0_28px_70px_-30px_rgba(225,48,108,0.45)]",
    tabActive: "from-amber-500 via-pink-500 to-purple-600",
    blobs: [
      "h-72 w-72 left-[-6%] top-[-8%] bg-fuchsia-400/30",
      "h-64 w-64 right-[-6%] top-[12%] bg-amber-300/40",
      "h-80 w-80 left-[35%] bottom-[-14%] bg-purple-400/25",
    ],
  },

  facebook: {
    id: "facebook",
    name: "Facebook",
    handle: "MohanMaya",
    Icon: FaFacebookF,
    accent: "#1877F2",
    isDark: false,
    tagline: "Join the collectors' community",
    cta: "Follow",
    highlights: ["Community stories", "Festival drops", "Member Q&As"],
    pageBg: "bg-gradient-to-br from-[#eef3ff] via-[#f5f8ff] to-white",
    overlay:
      "bg-[radial-gradient(55%_40%_at_50%_0%,rgba(24,119,242,0.14),transparent_70%)]",
    text: "text-gray-900",
    textMuted: "text-gray-500",
    heading: "text-gray-900",
    surface: "border border-blue-100 bg-white",
    chip: "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200",
    gradient: "from-blue-600 to-blue-500",
    gradientHover: "hover:from-blue-500 hover:to-blue-400",
    glow: "shadow-[0_28px_70px_-30px_rgba(24,119,242,0.4)]",
    tabActive: "from-blue-600 to-blue-500",
    blobs: [
      "h-72 w-72 left-[-6%] top-[-8%] bg-blue-400/25",
      "h-80 w-80 right-[-8%] bottom-[-10%] bg-sky-300/30",
    ],
  },
};

export const PLATFORM_ORDER = ["youtube", "instagram", "facebook"];

export const getTheme = (id) => PLATFORM_THEMES[id] || PLATFORM_THEMES.youtube;
