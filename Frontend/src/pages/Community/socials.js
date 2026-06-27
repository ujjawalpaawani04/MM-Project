import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

/**
 * Single source of truth for the community's social presence.
 *
 * Edit the `url` / `handle` fields to point at the real profiles. The YouTube
 * subscriber count is filled in live from the backend (/api/youtube/channel);
 * Instagram / Facebook counts stay null until their Graph APIs are wired up,
 * and the UI simply hides the count when it's absent.
 */
export const SOCIALS = [
  {
    id: "youtube",
    name: "YouTube",
    handle: "@mohanmaya",
    url: "https://www.youtube.com/results?search_query=mohanmaya",
    cta: "Subscribe",
    metricLabel: "Subscribers",
    Icon: FaYoutube,
    // Brand-true accent used for the icon chip + hover glow.
    accent: "#FF0000",
    gradient: "from-red-500 to-rose-500",
    blurb:
      "Devotional shorts, emotional stories and behind-the-scenes from the workshop.",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@mohanmaya",
    url: "https://instagram.com/mohanmaya_",
    cta: "Follow",
    metricLabel: "Followers",
    Icon: FaInstagram,
    accent: "#E1306C",
    gradient: "from-amber-500 via-pink-500 to-purple-600",
    blurb:
      "Close-up reels of every hand-painted detail, new drops and daily moments.",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "MohanMaya",
    url: "https://www.facebook.com/share/18dgmfQ39U/",
    cta: "Follow",
    metricLabel: "Followers",
    Icon: FaFacebookF,
    accent: "#1877F2",
    gradient: "from-blue-500 to-blue-600",
    blurb:
      "Community stories, festival collections and announcements for collectors.",
  },
];

export default SOCIALS;
