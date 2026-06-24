import Maya from "../assets/website/Maya.jpeg";
import Madhav from "../assets/website/Madhav.jpeg";
import Madhvi from "../assets/website/Madhvi.jpeg";
import Mother from "../assets/website/Mother.jpeg";
import RadhaJi from "../assets/website/RadhaJi.jpeg";
import Krishna from "../assets/website/Krishna.jpeg";
import Shiva from "../assets/website/Shiva.jpeg";

// Demo 3D model - reused for products flagged as model-enabled. Swap per-product
// when real .glb files are available. Products without `model` fall back to images.
import demoModel from "../assets/models/mmModel2.opt.glb";

/** Filter option sources (single source of truth for the Shop filters). */
export const CATEGORIES = [
  "Festival Collection",
  "Wedding Collection",
  "Birthday Collection",
  "Seasonal Collection",
  "Limited Edition",
];

export const CHARACTERS = [
  "Maya",
  "Mohan",
  "Mother",
  "Radha Ji",
  "Krishna",
  "Shiva",
];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "latest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "rating-desc", label: "Top Rated" },
];

export const PRICE_RANGES = [
  { id: "under-999", label: "Under ₹999", min: 0, max: 999 },
  { id: "999-1999", label: "₹999 - ₹1999", min: 999, max: 1999 },
  { id: "1999-2999", label: "₹1999 - ₹2999", min: 1999, max: 2999 },
  { id: "3000-plus", label: "₹3000+", min: 3000, max: Infinity },
];

const sampleReviews = [
  {
    name: "Ananya R.",
    rating: 5,
    comment: "Stunning detail. It sits proudly on my puja shelf!",
    date: "2026-05-12",
  },
  {
    name: "Vikram S.",
    rating: 4,
    comment: "Beautiful craftsmanship, packaging could be sturdier.",
    date: "2026-04-28",
  },
  {
    name: "Priya M.",
    rating: 5,
    comment: "Gifted it to my mother - she absolutely loved it.",
    date: "2026-03-19",
  },
];

/**
 * Product catalog. `slug` is the URL key used by /product/:slug.
 * `model` is optional - the 3D viewer falls back to the gallery when absent.
 */
export const products = [
  {
    id: 1,
    slug: "maya-village-dawn",
    name: "Maya - Village Dawn",
    character: "Maya",
    category: "Festival Collection",
    image: Maya,
    gallery: [Maya, Madhvi, Mother],
    model: demoModel,
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 124,
    stock: "in-stock",
    badge: "Bestseller",
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: "2026-01-15",
    material: "Hand-painted polyresin",
    height: "12 cm",
    description:
      "A finely hand-painted miniature capturing Maya at the break of dawn - the moment courage meets the day's first light.",
  },
  {
    id: 2,
    slug: "mohan-divine-protector",
    name: "Mohan - Divine Protector",
    character: "Mohan",
    category: "Limited Edition",
    image: Madhav,
    gallery: [Madhav, Krishna, Maya],
    model: demoModel,
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 208,
    stock: "in-stock",
    badge: "Limited",
    featured: true,
    bestSeller: true,
    newArrival: true,
    createdAt: "2026-05-02",
    material: "Resin with gold-leaf accents",
    height: "16 cm",
    description:
      "The flagship Mohan figure - radiant, watchful and crafted with gold-leaf detailing fit for a divine protector.",
  },
  {
    id: 3,
    slug: "radha-ji-eternal-devotion",
    name: "Radha Ji - Eternal Devotion",
    character: "Radha Ji",
    category: "Wedding Collection",
    image: RadhaJi,
    gallery: [RadhaJi, Krishna, Madhvi],
    price: 1899,
    originalPrice: 2299,
    rating: 4.7,
    reviewCount: 96,
    stock: "in-stock",
    badge: null,
    featured: true,
    bestSeller: false,
    newArrival: true,
    createdAt: "2026-04-20",
    material: "Hand-painted polyresin",
    height: "14 cm",
    description:
      "Radha Ji rendered in serene devotion, her expression a quiet meditation on pure love.",
  },
  {
    id: 4,
    slug: "krishna-eternal-friend",
    name: "Krishna - Eternal Friend",
    character: "Krishna",
    category: "Festival Collection",
    image: Krishna,
    gallery: [Krishna, RadhaJi, Shiva],
    model: demoModel,
    price: 2199,
    originalPrice: 2599,
    rating: 4.9,
    reviewCount: 187,
    stock: "in-stock",
    badge: "Bestseller",
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: "2026-02-10",
    material: "Resin with hand-painted flute",
    height: "15 cm",
    description:
      "Krishna with his flute - playful, wise and endlessly reassuring. A centerpiece for any collection.",
  },
  {
    id: 5,
    slug: "shiva-cosmic-guardian",
    name: "Shiva - Cosmic Guardian",
    character: "Shiva",
    category: "Limited Edition",
    image: Shiva,
    gallery: [Shiva, Krishna, Madhav],
    price: 2899,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 142,
    stock: "pre-order",
    badge: "Pre-order",
    featured: false,
    bestSeller: true,
    newArrival: true,
    createdAt: "2026-05-18",
    material: "Resin with cold-cast bronze base",
    height: "18 cm",
    description:
      "Shiva in meditative stillness atop a bronze-finish base - power and serenity in perfect balance.",
  },
  {
    id: 6,
    slug: "mother-guiding-heart",
    name: "Mother - The Guiding Heart",
    character: "Mother",
    category: "Birthday Collection",
    image: Mother,
    gallery: [Mother, Maya, Madhvi],
    price: 1299,
    originalPrice: 1599,
    rating: 4.6,
    reviewCount: 73,
    stock: "in-stock",
    badge: null,
    featured: false,
    bestSeller: false,
    newArrival: false,
    createdAt: "2026-03-01",
    material: "Hand-painted polyresin",
    height: "13 cm",
    description:
      "A warm tribute to the nurturing heart of the story - the perfect heartfelt gift.",
  },
  {
    id: 7,
    slug: "maya-festival-of-lights",
    name: "Maya - Festival of Lights",
    character: "Maya",
    category: "Festival Collection",
    image: Madhvi,
    gallery: [Madhvi, Maya, RadhaJi],
    price: 1499,
    originalPrice: 1799,
    rating: 4.7,
    reviewCount: 88,
    stock: "in-stock",
    badge: "New",
    featured: false,
    bestSeller: false,
    newArrival: true,
    createdAt: "2026-05-25",
    material: "Hand-painted polyresin with diya",
    height: "12 cm",
    description:
      "Maya holding a glowing diya, celebrating the festival of lights - radiant hope made tangible.",
  },
  {
    id: 8,
    slug: "krishna-radha-union",
    name: "Krishna & Radha - Sacred Union",
    character: "Krishna",
    category: "Wedding Collection",
    image: Krishna,
    gallery: [Krishna, RadhaJi],
    price: 3499,
    originalPrice: 3999,
    rating: 5.0,
    reviewCount: 54,
    stock: "in-stock",
    badge: "Premium",
    featured: true,
    bestSeller: false,
    newArrival: true,
    createdAt: "2026-06-01",
    material: "Resin with gold-leaf accents",
    height: "20 cm",
    description:
      "The divine couple together - a premium wedding-collection piece symbolising eternal love.",
  },
  {
    id: 9,
    slug: "shiva-meditation-seasonal",
    name: "Shiva - Himalayan Calm",
    character: "Shiva",
    category: "Seasonal Collection",
    image: Shiva,
    gallery: [Shiva, Mother],
    price: 1999,
    originalPrice: 2399,
    rating: 4.5,
    reviewCount: 61,
    stock: "coming-soon",
    badge: "Coming Soon",
    featured: false,
    bestSeller: false,
    newArrival: false,
    createdAt: "2026-06-08",
    material: "Hand-painted polyresin",
    height: "15 cm",
    description:
      "A seasonal edition capturing Shiva amid Himalayan snow - limited winter craftsmanship.",
  },
  {
    id: 10,
    slug: "mohan-maya-together",
    name: "Mohan & Maya - Bond of Faith",
    character: "Mohan",
    category: "Birthday Collection",
    image: Madhav,
    gallery: [Madhav, Maya, Mother],
    model: demoModel,
    price: 2799,
    originalPrice: 3299,
    rating: 4.9,
    reviewCount: 119,
    stock: "in-stock",
    badge: "Bestseller",
    featured: true,
    bestSeller: true,
    newArrival: false,
    createdAt: "2026-02-22",
    material: "Resin diorama base",
    height: "17 cm",
    description:
      "Mohan and Maya side by side - the defining image of devotion and protection from the story.",
  },
  {
    id: 11,
    slug: "radha-ji-spring-blossom",
    name: "Radha Ji - Spring Blossom",
    character: "Radha Ji",
    category: "Seasonal Collection",
    image: RadhaJi,
    gallery: [RadhaJi, Madhvi],
    price: 1699,
    originalPrice: 1999,
    rating: 4.6,
    reviewCount: 47,
    stock: "in-stock",
    badge: "New",
    featured: false,
    bestSeller: false,
    newArrival: true,
    createdAt: "2026-05-30",
    material: "Hand-painted polyresin",
    height: "14 cm",
    description:
      "Radha Ji amid spring blossoms - a delicate seasonal celebration of renewal.",
  },
  {
    id: 12,
    slug: "krishna-bal-gopal",
    name: "Krishna - Bal Gopal",
    character: "Krishna",
    category: "Birthday Collection",
    image: Krishna,
    gallery: [Krishna, Mother],
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 156,
    stock: "in-stock",
    badge: "Bestseller",
    featured: false,
    bestSeller: true,
    newArrival: false,
    createdAt: "2026-01-30",
    material: "Hand-painted polyresin",
    height: "10 cm",
    description:
      "The beloved child Krishna - a charming, affordable piece perfect for gifting.",
  },
]
  // Per-product on-hand units (drives the stock badges). `coming-soon` items
  // have 0 units; everything else gets a realistic quantity, with a few kept
  // deliberately low so the "Only N left" / "Limited Stock" states are visible.
  .map((p) => {
    const stockCounts = {
      1: 12, 2: 8, 3: 3, 4: 15, 5: 20, 6: 5,
      7: 9, 8: 2, 9: 0, 10: 7, 11: 4, 12: 24,
    };
    return {
      ...p,
      reviews: sampleReviews,
      stockCount: p.stock === "coming-soon" ? 0 : stockCounts[p.id] ?? 10,
    };
  });

/** Below this on-hand quantity an in-stock item is flagged as "limited". */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Normalises a product's availability into a single descriptor the UI can use
 * for badges, labels and the add-to-cart disabled state.
 *
 * Returns: { status, label, shortLabel, count, tone, className, purchasable }
 *   status: "in-stock" | "limited" | "pre-order" | "out"
 */
export const getStockInfo = (product) => {
  const count = product?.stockCount ?? 0;

  if (product?.stock === "coming-soon" || count <= 0) {
    return {
      status: "out",
      label: "Out of Stock",
      shortLabel: "Out of Stock",
      count: 0,
      tone: "neutral",
      className: "text-gray-500",
      purchasable: false,
    };
  }

  if (product?.stock === "pre-order") {
    return {
      status: "pre-order",
      label: "Available for Pre-order",
      shortLabel: "Pre-order",
      count,
      tone: "warning",
      className: "text-amber-600",
      purchasable: true,
    };
  }

  if (count <= LOW_STOCK_THRESHOLD) {
    return {
      status: "limited",
      label: `Limited Stock - only ${count} left`,
      shortLabel: `Only ${count} Left`,
      count,
      tone: "warning",
      className: "text-amber-600",
      purchasable: true,
    };
  }

  return {
    status: "in-stock",
    label: "In Stock",
    shortLabel: "In Stock",
    count,
    tone: "success",
    className: "text-green-600",
    purchasable: true,
  };
};

export const getProductBySlug = (slug) =>
  products.find((p) => p.slug === slug);

export const getRelatedProducts = (product, limit = 4) =>
  products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.character === product.character || p.category === product.category)
    )
    .slice(0, limit);

export const getFeatured = () => products.filter((p) => p.featured);
export const getBestSellers = () => products.filter((p) => p.bestSeller);
export const getNewArrivals = () => products.filter((p) => p.newArrival);

/**
 * Recommendations for the cart / wishlist "you may also like" sections.
 * Excludes the supplied ids and prioritises best-sellers, then featured items.
 */
export const getRecommended = (excludeIds = [], limit = 4) => {
  const exclude = new Set(excludeIds);
  const score = (p) => (p.bestSeller ? 2 : 0) + (p.featured ? 1 : 0);
  return products
    .filter((p) => !exclude.has(p.id) && getStockInfo(p).purchasable)
    .sort((a, b) => score(b) - score(a) || b.rating - a.rating)
    .slice(0, limit);
};
