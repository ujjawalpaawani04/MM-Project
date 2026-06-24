import { useEffect, useRef, useState } from "react";

/**
 * Lightweight typewriter effect (no dependencies).
 *
 * Cycles through `phrases`, typing one out, pausing, deleting it, then moving
 * to the next - looping forever. Pass `enabled: false` to freeze and reset the
 * animation (e.g. while the user is typing in the field), which also avoids the
 * per-character re-renders when the effect isn't needed.
 *
 * Indices are kept in refs so the timing loop never re-subscribes mid-phrase;
 * the only state that triggers a render is the visible `text`.
 *
 * @returns {string} the currently visible animated substring
 */
export default function useTypewriter(
  phrases,
  {
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseAfterTyping = 1600,
    pauseAfterDeleting = 400,
    enabled = true,
  } = {}
) {
  const [text, setText] = useState("");
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const phase = useRef("typing"); // "typing" | "pausing" | "deleting"

  useEffect(() => {
    if (!enabled || !phrases?.length) {
      // Reset so the animation restarts cleanly the next time it's enabled.
      // The functional updater bails out when text is already empty, so this
      // never triggers a cascading re-render - it only syncs the one case where
      // visible text must be cleared because the effect was switched off.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- external-sync reset, bails out when already empty
      setText((t) => (t === "" ? t : ""));
      phraseIndex.current = 0;
      charIndex.current = 0;
      phase.current = "typing";
      return;
    }

    let timeoutId;

    const tick = () => {
      const current = phrases[phraseIndex.current % phrases.length];

      if (phase.current === "typing") {
        charIndex.current += 1;
        setText(current.slice(0, charIndex.current));
        if (charIndex.current >= current.length) {
          phase.current = "pausing";
          timeoutId = setTimeout(tick, pauseAfterTyping);
        } else {
          timeoutId = setTimeout(tick, typingSpeed);
        }
      } else if (phase.current === "pausing") {
        phase.current = "deleting";
        timeoutId = setTimeout(tick, deletingSpeed);
      } else {
        charIndex.current -= 1;
        setText(current.slice(0, Math.max(0, charIndex.current)));
        if (charIndex.current <= 0) {
          phase.current = "typing";
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
          timeoutId = setTimeout(tick, pauseAfterDeleting);
        } else {
          timeoutId = setTimeout(tick, deletingSpeed);
        }
      }
    };

    timeoutId = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [
    enabled,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseAfterTyping,
    pauseAfterDeleting,
  ]);

  return text;
}
