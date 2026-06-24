import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";

/**
 * Loads the channel's latest uploads from our backend and exposes a
 * "Load More" cursor (YouTube's nextPageToken).
 *
 * Optimised against unnecessary re-fetching:
 *  - The first page is fetched once on mount.
 *  - A ref guards against React 19 StrictMode's double-invoke in dev.
 *  - Already-loaded videos persist in state, so switching Community tabs and
 *    coming back does NOT trigger a network request.
 */
export function useYouTubeVideos({ pageSize = 9 } = {}) {
  const [videos, setVideos] = useState([]);
  // Starts in "loading" because the first page is always fetched on mount -
  // this shows skeletons on the very first paint instead of an empty flash.
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const didInit = useRef(false);

  const fetchPage = useCallback(
    async (pageToken = "") => {
      const isFirst = !pageToken;
      isFirst ? setStatus("loading") : setIsLoadingMore(true);
      setError(null);

      try {
        const { data } = await api.get("/api/youtube/videos", {
          params: { pageToken, maxResults: pageSize },
        });
        setVideos((prev) =>
          isFirst ? data.videos : dedupe([...prev, ...data.videos])
        );
        setNextPageToken(data.nextPageToken);
        setStatus("success");
      } catch (err) {
        // Prefer the backend's friendly message; fall back to a generic one.
        setError(
          err.response?.data?.error ||
            "We couldn't load the latest videos right now."
        );
        if (isFirst) setStatus("error");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchPage("");
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (nextPageToken && !isLoadingMore) fetchPage(nextPageToken);
  }, [nextPageToken, isLoadingMore, fetchPage]);

  const retry = useCallback(() => fetchPage(""), [fetchPage]);

  return {
    videos,
    status,
    error,
    isLoadingMore,
    hasMore: Boolean(nextPageToken),
    loadMore,
    retry,
  };
}

/** Guard against duplicate videoIds if pages ever overlap. */
function dedupe(list) {
  const seen = new Set();
  return list.filter((v) => {
    if (seen.has(v.videoId)) return false;
    seen.add(v.videoId);
    return true;
  });
}

export default useYouTubeVideos;
