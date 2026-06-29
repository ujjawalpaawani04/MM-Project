/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Premium "fly to cart" animation system.
 *
 * A product thumbnail is cloned and flown along a smooth, consistent curved arc
 * into the header cart icon (GPU transforms only), gradually shrinking until it
 * merges into the icon - after which the cart gives a subtle bounce/pop.
 *
 * Design goals:
 *  - Cart update is deferred to arrival. Callers pass their cart mutation as the
 *    third arg: `fly(sourceEl, image, () => addItem(product, qty))`. The callback
 *    runs only once the clone lands in the cart icon (or immediately on the
 *    reduced-motion / no-clone fallback so the cart still updates). This keeps
 *    the header count in sync with the animation - never ahead of it. The
 *    animation is the success feedback - there is no toast.
 *  - Identical, elegant curve for every product regardless of its position: the
 *    path is a quadratic Bézier with the timing baked into the sampled points,
 *    so the motion is deterministic and never random.
 *  - No re-renders of the app/product grids. Flights and the cart "pulse" are
 *    delivered through ref-based subscriptions, so only the tiny <FlyLayer> and
 *    the header cart re-render - never the consumers that call `fly`.
 *  - Concurrency-safe: each click spawns an independent clone keyed by id, so
 *    rapid clicks simply overlap gracefully (no shared timers to glitch).
 *  - Accessible: honours prefers-reduced-motion (skips the clone, the cart
 *    count still updates).
 */
const FlyToCartContext = createContext(null);

// Monotonic id for clones (module-level so it survives provider re-renders).
let flightSeq = 0;

// Cap the clone size so a large product-details image still feels graceful.
const MAX_CLONE = 170;
// Approx. on-screen size of the cart icon - drives how small the clone lands.
const CART_ICON_SIZE = 26;
// Number of points the Bézier arc is sampled into (more = smoother).
const ARC_STEPS = 20;
const FLIGHT_DURATION = 0.78;

/** Smooth, symmetric acceleration/deceleration (easeInOutCubic). Baked into the
 *  arc sampling so the geometric path stays exact while speed feels premium. */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Shrinks an over-sized source rect toward its centre, keeping aspect ratio. */
function capBox({ left, top, width, height }) {
  if (width <= MAX_CLONE && height <= MAX_CLONE) return { left, top, width, height };
  const scale = MAX_CLONE / Math.max(width, height);
  const w = width * scale;
  const h = height * scale;
  return { left: left + (width - w) / 2, top: top + (height - h) / 2, width: w, height: h };
}

export function FlyToCartProvider({ children }) {
  const prefersReduced = useReducedMotion();

  const cartTargetRef = useRef(null);
  const cartFallbackRef = useRef(null);
  const flightListeners = useRef(new Set());
  const arriveListeners = useRef(new Set());

  // The header registers its primary (desktop) cart icon element here.
  const registerCartTarget = useCallback((el) => {
    cartTargetRef.current = el;
  }, []);

  // Fallback target for breakpoints where the primary cart icon is hidden
  // (e.g. the mobile menu button, which is the cart's entry point on small
  // screens). Used only when the primary target isn't currently visible.
  const registerCartFallback = useCallback((el) => {
    cartFallbackRef.current = el;
  }, []);

  // An element counts as a valid flight destination only if it's actually laid
  // out (a `display:none` element - e.g. the lg-only cart icon on mobile -
  // reports a zero-sized rect, which would otherwise send clones to (0,0)).
  const resolveTarget = useCallback(() => {
    for (const el of [cartTargetRef.current, cartFallbackRef.current]) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return el;
    }
    return null;
  }, []);

  const subscribeFlights = useCallback((cb) => {
    flightListeners.current.add(cb);
    return () => flightListeners.current.delete(cb);
  }, []);

  const subscribeArrive = useCallback((cb) => {
    arriveListeners.current.add(cb);
    return () => arriveListeners.current.delete(cb);
  }, []);

  // Fired the moment a clone "lands" (or immediately on the reduced-motion
  // path): give the cart its bounce/pop. No toast - the flight is the feedback.
  const celebrate = useCallback(() => {
    arriveListeners.current.forEach((cb) => cb());
  }, []);

  const fly = useCallback(
    (sourceEl, image, onComplete) => {
      // Runs exactly once when the item "arrives": first commit the cart
      // mutation (so the count reflects the just-landed item), then play the
      // header bounce/badge-pop/sparkle. Deferring it here is what keeps the
      // count from updating ahead of the animation.
      const finish = () => {
        onComplete?.();
        celebrate();
      };

      const target = resolveTarget();
      // No source/target, no image, or reduced motion → skip the clone but
      // still complete immediately, so the cart always updates.
      if (prefersReduced || !sourceEl || !target || !image) {
        finish();
        return;
      }

      const from = capBox(sourceEl.getBoundingClientRect());
      // Rect is read fresh at click time, so the destination is always the
      // cart icon's current on-screen position (responsive to layout/resize).
      const to = target.getBoundingClientRect();

      flightListeners.current.forEach((cb) =>
        cb({
          id: ++flightSeq,
          image,
          from,
          toX: to.left + to.width / 2,
          toY: to.top + to.height / 2,
          onArrive: finish,
        })
      );
    },
    [prefersReduced, celebrate, resolveTarget]
  );

  const value = useMemo(
    () => ({
      fly,
      registerCartTarget,
      registerCartFallback,
      subscribeFlights,
      subscribeArrive,
    }),
    [
      fly,
      registerCartTarget,
      registerCartFallback,
      subscribeFlights,
      subscribeArrive,
    ]
  );

  return (
    <FlyToCartContext.Provider value={value}>
      {children}
      <FlyLayer subscribe={subscribeFlights} />
    </FlyToCartContext.Provider>
  );
}

/** Portal layer that owns the live clones. Isolated so flight state changes
 *  never re-render the rest of the app. */
function FlyLayer({ subscribe }) {
  const [flights, setFlights] = useState([]);

  useEffect(
    () => subscribe((flight) => setFlights((prev) => [...prev, flight])),
    [subscribe]
  );

  const handleDone = useCallback((flight) => {
    flight.onArrive?.();
    setFlights((prev) => prev.filter((f) => f.id !== flight.id));
  }, []);

  if (!flights.length) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {flights.map((f) => (
        <FlyingClone key={f.id} flight={f} onDone={() => handleDone(f)} />
      ))}
    </div>,
    document.body
  );
}

/** A single product-image clone that arcs from its origin into the cart. The
 *  path is a quadratic Bézier sampled with eased timing baked in, so every
 *  product follows the same elegant curve at a premium, consistent pace. Uses
 *  only transform/opacity (GPU-accelerated, 60 FPS). */
function FlyingClone({ flight, onDone }) {
  const { image, from, toX, toY } = flight;

  const { xs, ys, endScale } = useMemo(() => {
    const fromCx = from.left + from.width / 2;
    const fromCy = from.top + from.height / 2;
    const dx = toX - fromCx;
    const dy = toY - fromCy;

    // Control point: the midpoint lifted upward by an amount that scales gently
    // with travel distance (clamped) - identical curve geometry for every card.
    const distance = Math.hypot(dx, dy);
    const lift = Math.min(180, Math.max(70, distance * 0.22));
    const cx = dx / 2;
    const cy = dy / 2 - lift;

    const xs = [];
    const ys = [];
    for (let i = 0; i <= ARC_STEPS; i++) {
      const t = easeInOutCubic(i / ARC_STEPS);
      const mt = 1 - t;
      // Quadratic Bézier: (0,0) → (cx,cy) → (dx,dy)
      xs.push(2 * mt * t * cx + t * t * dx);
      ys.push(2 * mt * t * cy + t * t * dy);
    }

    // Shrink so the clone merges into roughly the cart icon's size.
    const endScale = Math.max(
      0.1,
      Math.min(0.4, CART_ICON_SIZE / Math.max(from.width, from.height))
    );
    return { xs, ys, endScale };
  }, [from, toX, toY]);

  return (
    <motion.img
      src={image}
      alt=""
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{
        x: xs,
        y: ys,
        // Subtle lift at the start, then a smooth shrink that merges into the cart.
        scale: [1, 1.06, endScale],
        // Stay solid through the flight, fade only at the very end to "absorb".
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: FLIGHT_DURATION,
        // Easing is baked into the sampled points, so step through them linearly.
        x: { duration: FLIGHT_DURATION, ease: "linear" },
        y: { duration: FLIGHT_DURATION, ease: "linear" },
        scale: { duration: FLIGHT_DURATION, ease: [0.4, 0, 0.2, 1], times: [0, 0.22, 1] },
        opacity: { duration: FLIGHT_DURATION, ease: "easeIn", times: [0, 0.82, 1] },
      }}
      onAnimationComplete={onDone}
      style={{
        position: "fixed",
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        objectFit: "cover",
        borderRadius: 16,
        willChange: "transform, opacity",
        boxShadow: "0 16px 40px -12px rgba(196,31,107,0.5)",
        outline: "2px solid rgba(255,255,255,0.7)",
        outlineOffset: "-2px",
      }}
    />
  );
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error("useFlyToCart must be used within a FlyToCartProvider");
  return ctx;
}
