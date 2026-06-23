import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

/**
 * Fetches public YouTube channel metadata (subscriber/video/view counts) from
 * our backend, once. Non-critical: on failure it resolves to null and callers
 * simply omit anything that depends on it. A ref guards React 19 StrictMode's
 * double-invoke in dev so we never fire the request twice.
 */
export function useChannel() {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let alive = true;
    api
      .get("/api/youtube/channel")
      .then(({ data }) => alive && setChannel(data))
      .catch(() => alive && setChannel(null))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  return { channel, loading };
}

export default useChannel;
