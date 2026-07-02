import { useEffect, useState } from "react";

/**
 * Returns the pixel offset a page must leave at the top to clear the global
 * header, measured from the real header element (never a hard-coded guess).
 *
 * Why this is needed: the site header is `sticky top-0` on small/medium screens
 * - it occupies layout flow, so page content already sits below it and no offset
 * is required (this hook returns 0). On xl screens the header's inner bar
 * switches to a `fixed` floating pill (`position: fixed`), which is removed from
 * flow; without a manual offset the page content slides up underneath it. In
 * that mode the hook returns the header's bottom edge plus a small gap.
 *
 * The value is recomputed on resize and whenever the header resizes (via
 * ResizeObserver), so it stays correct across breakpoints and if the header's
 * height ever changes - keeping the fix responsive and self-adjusting.
 *
 * @param {number} gap - breathing room (px) to add below a fixed header.
 */
export default function useHeaderOffset(gap = 24) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // The floating/fixed bar is the header's first child; the sticky <header>
    // itself stays in flow. Querying the DOM avoids modifying the header.
    const bar = document.querySelector("header")?.firstElementChild;
    if (!bar) return;

    const measure = () => {
      const isFixed = getComputedStyle(bar).position === "fixed";
      // A sticky (in-flow) header already reserves its own space, so only a
      // fixed (out-of-flow) header needs the content pushed down.
      setOffset(
        isFixed ? Math.round(bar.getBoundingClientRect().bottom + gap) : 0
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [gap]);

  return offset;
}
