import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";

/**
 * Fetches the Community Instagram tab's data (public profile + recent posts)
 * from our backend in a single request. The backend proxies RapidAPI so no key
 * is exposed client-side.
 *
 * Mirrors useYouTubeVideos' state machine (loading | success | error) and its
 * StrictMode guard. Note: we deliberately do NOT use an `alive`/cleanup flag -
 * the `didInit` ref already prevents a double request, and a cleanup that flips
 * `alive=false` on StrictMode's dev remount would permanently swallow the only
 * in-flight response (the bug that previously froze the channel header).
 */
export function useInstagram() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);

  const didInit = useRef(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { data } = await api.get("/api/instagram");
      setProfile(data?.profile || null);
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
      setStatus("success");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "We couldn't load Instagram content right now."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    load();
  }, [load]);

  return { profile, posts, status, error, retry: load };
}

export default useInstagram;
