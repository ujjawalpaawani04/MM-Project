import { products } from "../data/products";

/**
 * Order + tracking model (no backend).
 *
 * Orders placed at checkout are persisted to localStorage under `mm-orders`,
 * each receiving a unique, human-readable tracking number like `MM-2026-000123`.
 * The Track Order page looks orders up by tracking (or order) number. A small
 * set of seeded demo orders lets visitors preview the experience without
 * checking out. This module is the single source of truth so a real API can
 * later replace the localStorage calls without touching the UI.
 */

const ORDERS_KEY = "mm-orders";
const SEQ_KEY = "mm-order-seq";
const SEQ_START = 123; // first generated tracking number → MM-2026-000123
const YEAR = 2026;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/** Ordered fulfilment stages shown on the tracking timeline. */
export const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed", description: "We've received your order." },
  { key: "processing", label: "Processing", description: "Your miniatures are being prepared." },
  { key: "packed", label: "Packed", description: "Carefully packed and ready to ship." },
  { key: "shipped", label: "Shipped", description: "Handed over to the courier." },
  { key: "out-for-delivery", label: "Out For Delivery", description: "Arriving today." },
  { key: "delivered", label: "Delivered", description: "Enjoy your collectible!" },
];

// Hours after which each step (index) is considered reached. Index 0 is always
// reached the moment the order is placed.
const STEP_HOURS = [0, 3, 26, 50, 98, 122];

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const read = () => safeParse(localStorage.getItem(ORDERS_KEY), []);

const write = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable / quota - non-fatal for a demo store */
  }
};

/** Parse the numeric sequence out of a tracking number (NaN if unparseable). */
const seqOf = (trackingNumber = "") =>
  parseInt(String(trackingNumber).replace(`MM-${YEAR}-`, ""), 10);

/**
 * Generate the next sequential tracking number, e.g. `MM-2026-000124`.
 *
 * Uniqueness is derived from BOTH the persisted counter and the highest
 * sequence already present in stored orders. Taking the max of the two keeps
 * numbers monotonic even if the counter write previously failed (quota/private
 * mode), so two orders can never share a tracking number while orders persist.
 */
function nextTrackingNumber(existingOrders = []) {
  let storedSeq = NaN;
  try {
    storedSeq = parseInt(localStorage.getItem(SEQ_KEY), 10);
  } catch {
    /* ignore - counter unavailable, fall back to order-derived sequence */
  }

  const highestOrderSeq = existingOrders.reduce((max, o) => {
    const n = seqOf(o.trackingNumber);
    return Number.isFinite(n) && n > max ? n : max;
  }, SEQ_START - 1);

  const base = Math.max(
    SEQ_START - 1,
    Number.isFinite(storedSeq) ? storedSeq : SEQ_START - 1,
    highestOrderSeq
  );
  const seq = base + 1;

  try {
    localStorage.setItem(SEQ_KEY, String(seq));
  } catch {
    /* ignore - next call re-derives from stored orders */
  }
  return `MM-${YEAR}-${String(seq).padStart(6, "0")}`;
}

const addDays = (ms, days) => ms + days * MS_PER_DAY;

/**
 * Create and persist an order from checkout details + the current cart.
 * Returns the stored order (including its tracking number).
 */
export function createOrder({ customer, items, subtotal, shipping, total }) {
  const placedAt = Date.now();
  const orders = read();
  const trackingNumber = nextTrackingNumber(orders);
  const order = {
    orderNumber: trackingNumber.replace(`MM-${YEAR}-`, "#MM"),
    trackingNumber,
    placedAt,
    estimatedDeliveryAt: addDays(placedAt, 6),
    carrier: "MohanMaya Express",
    customer,
    items: items.map((i) => ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      image: i.image,
      character: i.character,
      price: i.price,
      quantity: i.quantity,
    })),
    subtotal,
    shipping,
    total,
  };

  orders.unshift(order);
  write(orders);
  return order;
}

// A couple of pre-shipped demo orders so the Track page works out of the box.
const DEMO_ORDERS = [
  {
    orderNumber: "#MM000123",
    trackingNumber: "MM-2026-000123",
    placedAt: Date.now() - 3 * MS_PER_DAY,
    estimatedDeliveryAt: Date.now() + 3 * MS_PER_DAY,
    carrier: "MohanMaya Express",
    customer: { fullName: "Aarav Sharma", email: "aarav@example.com", city: "Mumbai" },
    items: [
      { ...products[1], quantity: 1 },
      { ...products[3], quantity: 2 },
    ],
    subtotal: products[1].price + products[3].price * 2,
    shipping: 0,
    total: products[1].price + products[3].price * 2,
  },
  {
    orderNumber: "#MM000124",
    trackingNumber: "MM-2026-000124",
    placedAt: Date.now() - 6 * MS_PER_HOUR,
    estimatedDeliveryAt: Date.now() + 6 * MS_PER_DAY,
    carrier: "MohanMaya Express",
    customer: { fullName: "Priya Menon", email: "priya@example.com", city: "Bengaluru" },
    items: [{ ...products[0], quantity: 1 }],
    subtotal: products[0].price,
    shipping: 99,
    total: products[0].price + 99,
  },
];

const normalize = (s = "") => s.trim().toUpperCase().replace(/\s+/g, "");

/**
 * All orders placed by a given user (most recent first), matched on the email
 * captured at checkout. Returns [] when signed out or no orders exist.
 */
export function getUserOrders(email) {
  const target = (email || "").trim().toLowerCase();
  if (!target) return [];
  return read()
    .filter((o) => (o.customer?.email || "").trim().toLowerCase() === target)
    .sort((a, b) => b.placedAt - a.placedAt);
}

/** Find an order by tracking number or order number. Returns null if absent. */
export function findOrder(query) {
  const q = normalize(query);
  if (!q) return null;
  const match = (o) =>
    normalize(o.trackingNumber) === q || normalize(o.orderNumber) === q;
  return read().find(match) || DEMO_ORDERS.find(match) || null;
}

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatOrderDate = (ms) => dateFmt.format(new Date(ms));

/**
 * Derive live fulfilment status from an order's placed time.
 * Returns the current step index, a per-step list (with done/active flags and
 * an estimated date), and the human label of the current stage.
 */
export function getOrderStatus(order) {
  const elapsedHours = (Date.now() - order.placedAt) / MS_PER_HOUR;
  let currentStep = 0;
  STEP_HOURS.forEach((h, i) => {
    if (elapsedHours >= h) currentStep = i;
  });

  const steps = STATUS_STEPS.map((s, i) => ({
    ...s,
    done: i < currentStep,
    active: i === currentStep,
    reached: i <= currentStep,
    date: formatOrderDate(addDays(order.placedAt, STEP_HOURS[i] / 24)),
  }));

  return {
    currentStep,
    steps,
    statusLabel: STATUS_STEPS[currentStep].label,
    isDelivered: currentStep === STATUS_STEPS.length - 1,
  };
}
