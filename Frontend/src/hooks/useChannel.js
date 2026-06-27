import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

/**
 * Fetches public YouTube channel metadata (subscriber/video/view counts) from
 * our backend, once. Non-critical: on failure it resolves to null and callers
 * simply omit anything that depends on it. A ref guards React 19 StrictMode's
 * double-invoke in dev so we never fire the request twice.
 *
 * NOTE: we deliberately do NOT use an `alive`/cleanup flag here. Because the
 * `didInit` ref already prevents a second request, StrictMode's mount→unmount→
 * remount cycle would run the cleanup (flipping `alive` to false) BEFORE the
 * single in-flight request resolves, permanently swallowing setChannel/
 * setLoading - leaving the header stuck on its skeleton in dev. Matching the
 * sibling useYouTubeVideos hook, we let the resolved request commit its state.
 */
export function useChannel() {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    api
      .get("/api/youtube/channel")
      .then(({ data }) => setChannel(data))
      .catch(() => setChannel(null))
      .finally(() => setLoading(false));
  }, []);

  return { channel, loading };
}

export default useChannel;
