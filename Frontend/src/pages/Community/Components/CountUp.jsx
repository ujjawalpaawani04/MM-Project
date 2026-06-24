import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animated number that counts up from 0 to `value` the first time it scrolls
 * into view. Honours the OS "reduce motion" setting (snaps straight to the
 * final value) and accepts an optional `format` fn (e.g. compact "1.2M").
 */
export default function CountUp({ value = 0, duration = 1.4, format }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced-motion users skip the animation entirely (value is rendered
    // directly below), so there's nothing to schedule here.
    if (!inView || reduceMotion) return;

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutCubic for a confident, decelerating count
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduceMotion]);

  const current = reduceMotion ? value : display;
  return <span ref={ref}>{format ? format(current) : Math.round(current)}</span>;
}
