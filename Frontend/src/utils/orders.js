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

/**
 * Presentation metadata for every order status the store supports, including
 * the requested set (Pending, Confirmed, Processing, Shipped, Delivered,
 * Cancelled) plus the finer-grained timeline stages. This is the single source
 * of truth for status labels and badge colours, consumed by <OrderStatusBadge>
 * so every page renders a status identically.
 *
 * `tone` keys into a Tailwind class set defined in the badge component.
 */
export const STATUS_META = {
  pending: { label: "Pending", tone: "pending" },
  confirmed: { label: "Confirmed", tone: "confirmed" },
  processing: { label: "Processing", tone: "processing" },
  packed: { label: "Packed", tone: "processing" },
  shipped: { label: "Shipped", tone: "shipped" },
  "out-for-delivery": { label: "Out For Delivery", tone: "shipped" },
  delivered: { label: "Delivered", tone: "delivered" },
  cancelled: { label: "Cancelled", tone: "cancelled" },
};

// A cancellation is only allowed before the order has physically shipped -
// once it's with the courier it can no longer be pulled back (mirrors how
// real stores like Amazon/Flipkart gate the "Cancel" action).
const SHIPPED_STEP_INDEX = STATUS_STEPS.findIndex((s) => s.key === "shipped");

/**
 * Predefined cancellation reasons shown in the cancel dialog, mirroring the
 * curated lists used by Amazon/Flipkart. Kept here (data) so the modal stays
 * presentation-only and a real API can later drive the same options.
 *
 * `OTHER_REASON` is the sentinel value that reveals the free-text field; keeping
 * it as an exported constant avoids magic strings leaking into the UI.
 */
export const OTHER_REASON = "Other";

export const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Item won't arrive in time",
  "Changed my mind",
  "Want to change payment method",
  OTHER_REASON,
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

/** Lowercase/trim an email for stable identity comparison. */
const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

/**
 * Create and persist an order from checkout details + the current cart.
 * Returns the stored order (including its tracking number).
 *
 * The order is linked to the authenticated account via `userEmail` (the stable
 * identity from the auth session), independent of whatever email is typed into
 * the shipping form. This is what guarantees the order shows up under that
 * user's "My Orders" - and only theirs - after logout/login.
 */
export function createOrder({
  userEmail,
  customer,
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  paymentMethod = "Cash on Delivery",
  paymentStatus,
}) {
  const placedAt = Date.now();
  const orders = read();
  const trackingNumber = nextTrackingNumber(orders);
  const order = {
    orderNumber: trackingNumber.replace(`MM-${YEAR}-`, "#MM"),
    trackingNumber,
    // Owner of the order (the signed-in account). Falls back to the typed
    // checkout email for guest checkouts.
    userEmail: normalizeEmail(userEmail || customer?.email),
    placedAt,
    estimatedDeliveryAt: addDays(placedAt, 6),
    carrier: "MohanMaya Express",
    paymentMethod,
    // Payment outcome captured at checkout (prepaid → "Paid", COD → "Pending").
    // Persisted so the record is stable; live display still derives via
    // getPaymentStatus so a COD order can flip to "Paid" once delivered.
    paymentStatus: paymentStatus || (isCOD(paymentMethod) ? "Pending" : "Paid"),
    // Fulfilment-status override. null means "derive from placedAt"; it is only
    // set to "cancelled" when the customer cancels. This is what lets a stored
    // status win over the time-based tracking timeline.
    status: null,
    cancelledAt: null,
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
    discount,
    total,
  };

  orders.unshift(order);
  write(orders);
  return order;
}

/** True when a payment method is Cash on Delivery (vs. a prepaid method). */
const isCOD = (method = "") => /cash on delivery|cod/i.test(method);

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
 * All orders owned by a given user (most recent first). Matches the account
 * `userEmail` stamped at checkout, and falls back to the typed checkout email
 * so orders placed before this link existed (and seeded demo orders) still
 * resolve. Returns [] when signed out or no orders exist.
 */
export function getUserOrders(email) {
  const target = normalizeEmail(email);
  if (!target) return [];
  return read()
    .filter(
      (o) =>
        // Cancelled orders are removed from the account, so never list them -
        // this also hides any order cancelled before delete-on-cancel existed.
        o.status !== "cancelled" &&
        (normalizeEmail(o.userEmail) === target ||
          normalizeEmail(o.customer?.email) === target)
    )
    .sort((a, b) => b.placedAt - a.placedAt);
}

/** Find an order by tracking number or order number. Returns null if absent. */
export function findOrder(query) {
  const q = normalize(query);
  if (!q) return null;
  const match = (o) =>
    // A cancelled order has been removed, so it should no longer be trackable.
    o.status !== "cancelled" &&
    (normalize(o.trackingNumber) === q || normalize(o.orderNumber) === q);
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
    statusKey: STATUS_STEPS[currentStep].key,
    statusLabel: STATUS_STEPS[currentStep].label,
    isDelivered: currentStep === STATUS_STEPS.length - 1,
    isCancelled: false,
  };
}

/**
 * The status to actually display. Returns the same shape as getOrderStatus,
 * but when an order has been cancelled it short-circuits to a frozen
 * "Cancelled" state (progress halted at the step reached when cancelled).
 *
 * All UI (My Orders, order details, Track Order) reads through this so a
 * cancelled order can never keep "advancing" along the time-based timeline.
 */
export function getEffectiveStatus(order) {
  if (order?.status !== "cancelled") return getOrderStatus(order);

  const frozenStep = Number.isFinite(order.cancelledAtStep)
    ? order.cancelledAtStep
    : 0;
  const steps = STATUS_STEPS.map((s, i) => ({
    ...s,
    done: i <= frozenStep,
    active: false,
    reached: i <= frozenStep,
    date: formatOrderDate(addDays(order.placedAt, STEP_HOURS[i] / 24)),
  }));

  return {
    currentStep: frozenStep,
    steps,
    statusKey: "cancelled",
    statusLabel: STATUS_META.cancelled.label,
    isDelivered: false,
    isCancelled: true,
    cancelledAt: order.cancelledAt,
    cancellationReason: order.cancellationReason || "",
  };
}

/**
 * Whether an order may still be cancelled: it must not already be cancelled
 * and must not have shipped yet. Guest/demo orders without a stored `status`
 * are evaluated purely on their live timeline position.
 */
export function canCancelOrder(order) {
  if (!order || order.status === "cancelled") return false;
  const { currentStep } = getOrderStatus(order);
  return currentStep < SHIPPED_STEP_INDEX;
}

/**
 * Cancel an order by tracking number and remove it from the account.
 *
 * On cancellation the order is deleted from storage entirely, so it no longer
 * appears in the customer's "My Orders" list. `reason` is the customer-selected
 * reason - a predefined option or their free-text "Other" note - which a real
 * backend would receive with the cancellation; it's returned on the removed
 * order so the caller can log/confirm it. Returns the removed order, or null if
 * it can't be found or is no longer eligible (already shipped) - callers should
 * surface an error in that case.
 */
export function cancelOrder(trackingNumber, reason = "") {
  const orders = read();
  const idx = orders.findIndex((o) => o.trackingNumber === trackingNumber);
  if (idx === -1) return null;

  const order = orders[idx];
  if (!canCancelOrder(order)) return null;

  // Remove the order from the account entirely once cancelled.
  orders.splice(idx, 1);
  write(orders);
  return { ...order, cancellationReason: String(reason || "").trim() };
}

/**
 * Derive a payment status for display. Cash-on-Delivery is "Pending" until the
 * order is delivered, then "Paid"; prepaid methods read "Paid" from the start.
 * Returns { label, tone } where tone keys into a tailwind colour set.
 */
export function getPaymentStatus(order) {
  const method = order.paymentMethod || "Cash on Delivery";

  // A cancelled order's payment is settled by its cancellation outcome, not by
  // fulfilment progress.
  if (order.status === "cancelled") {
    const refunded = !isCOD(method);
    return {
      method,
      paid: false,
      label: refunded ? "Refund Initiated" : "Cancelled",
      tone: refunded ? "info" : "cancelled",
    };
  }

  const { isDelivered } = getOrderStatus(order);
  // Prepaid methods are paid up front; COD stays pending until delivered.
  const paid = !isCOD(method) || isDelivered;
  return {
    method,
    paid,
    label: paid ? "Paid" : "Pending",
    tone: paid ? "success" : "pending",
  };
}
