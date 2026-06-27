import axios from "axios";
import { env } from "../config/env.js";
import { cache } from "../utils/cache.js";

/**
 * Instagram data for the Community page, proxied through RapidAPI's
 * "instagram-scraper-stable-api". As with the YouTube service, the API key
 * never leaves the backend and responses are cached briefly to stay well under
 * the plan's request quota.
 *
 * ── Why this service is written defensively ──────────────────────────────────
 * RapidAPI scraper endpoints are notoriously inconsistent in their JSON shape
 * (snake_case vs the public Graph API's `edge_*` nesting, `items` vs `posts`,
 * `thumbnail_url` vs `image_versions2.candidates[]`, …) and they change without
 * notice. Rather than bind to one exact shape, every field is resolved through
 * a list of candidate paths, so the normaliser keeps working across the common
 * variants. The two endpoint names below are the ones confirmed live on the
 * host; if a future plan exposes a dedicated profile endpoint, only the
 * ENDPOINTS / PARAM constants need to change.
 */

const { rapidApiKey, rapidApiHost, username: IG_USERNAME, configured } =
  env.instagram;

// Confirmed-live POST endpoints on instagram-scraper-stable-api.
const ENDPOINTS = {
  posts: "/get_ig_user_posts.php",
  reels: "/get_ig_user_reels.php",
};

// The upstream validates a username; we send it under every plausible key +
// as a query param so a single request satisfies whichever the API reads.
const USERNAME_KEYS = ["username", "username_or_id_or_url", "user", "id"];

const TTL = {
  profile: 30 * 60 * 1000, // 30m - follower/post counts move slowly
  posts: 15 * 60 * 1000, // 15m - new posts appear within minutes
};

const ig = axios.create({
  baseURL: rapidApiHost ? `https://${rapidApiHost}` : undefined,
  timeout: 20_000,
  headers: {
    "x-rapidapi-key": rapidApiKey,
    "x-rapidapi-host": rapidApiHost,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

/** A clearly-typed error the controller maps to a 503 (vs an upstream 5xx). */
class NotConfiguredError extends Error {
  constructor() {
    super("Instagram integration is not configured on the server.");
    this.code = "IG_NOT_CONFIGURED";
    this.statusCode = 503;
  }
}

/* ----------------------------- shape helpers ----------------------------- */

/** Safely read a dotted path ("a.b.0.c") from a nested object/array. */
function get(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, obj);
}

/** First defined, non-empty value among several candidate paths. */
function pick(obj, paths) {
  for (const p of paths) {
    const v = get(obj, p);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
};

/** Locate the "user/owner" object wherever the upstream nests it. */
function findUserObject(data) {
  const candidates = [
    data?.user,
    data?.data?.user,
    data?.owner,
    data?.graphql?.user,
    data?.data,
    data?.result?.user,
    data?.user_data,
    // Some shapes hang the owner off the first post item.
    findPostsArray(data)?.[0]?.user,
    findPostsArray(data)?.[0]?.owner,
  ];
  return candidates.find((c) => c && typeof c === "object") || {};
}

/** Locate the array of post/reel items wherever the upstream nests it. */
function findPostsArray(data) {
  const candidates = [
    data?.posts,
    data?.items,
    data?.data?.items,
    data?.data?.posts,
    data?.edges,
    data?.data,
    data?.media,
    data?.user?.edge_owner_to_timeline_media?.edges,
    data?.results,
  ];
  const arr = candidates.find((c) => Array.isArray(c));
  return Array.isArray(arr) ? arr : [];
}

/* ------------------------------ normalisers ------------------------------ */

function normalizeProfile(data) {
  const u = findUserObject(data);
  return {
    username:
      pick(u, ["username", "user_name", "handle"]) || IG_USERNAME,
    fullName: pick(u, ["full_name", "fullName", "name"]) || "",
    biography: pick(u, ["biography", "bio", "description"]) || "",
    profilePic:
      pick(u, [
        "profile_pic_url_hd",
        "hd_profile_pic_url_info.url",
        "profile_pic_url",
        "profilePicUrl",
        "profile_picture",
        "avatar",
      ]) || "",
    isVerified: Boolean(pick(u, ["is_verified", "verified"])),
    followers: toInt(
      pick(u, [
        "follower_count",
        "followers",
        "followers_count",
        "edge_followed_by.count",
      ])
    ),
    following: toInt(
      pick(u, [
        "following_count",
        "following",
        "follows_count",
        "edge_follow.count",
      ])
    ),
    posts: toInt(
      pick(u, [
        "media_count",
        "posts_count",
        "post_count",
        "edge_owner_to_timeline_media.count",
      ])
    ),
    url: `https://www.instagram.com/${
      pick(u, ["username", "user_name"]) || IG_USERNAME
    }/`,
  };
}

/** Unwrap a post node that may be wrapped as `{ node: {...} }` (GraphQL edges). */
const unwrap = (item) => item?.node || item;

function normalizePost(rawItem) {
  const item = unwrap(rawItem);
  if (!item || typeof item !== "object") return null;

  const shortcode =
    pick(item, ["code", "shortcode", "short_code"]) || "";
  const id = pick(item, ["id", "pk", "fbid"]) || shortcode;

  const caption =
    pick(item, [
      "caption.text",
      "caption",
      "edge_media_to_caption.edges.0.node.text",
      "title",
      "accessibility_caption",
    ]) || "";

  const thumbnail =
    pick(item, [
      "thumbnail_url",
      "display_url",
      "image_versions2.candidates.0.url",
      "thumbnail_src",
      "display_src",
      "image_url",
      "cover_frame_url",
    ]) || "";

  // media_type: 1=image, 2=video, 8=carousel (Instagram's product_type ints).
  const mediaTypeRaw = pick(item, ["media_type", "type", "product_type"]);
  const isVideo =
    Boolean(pick(item, ["is_video", "video_url", "video_versions"])) ||
    mediaTypeRaw === 2 ||
    mediaTypeRaw === "video" ||
    String(pick(item, ["product_type"]) || "").includes("clips");

  return {
    id: String(id),
    shortcode: String(shortcode),
    caption: typeof caption === "string" ? caption : "",
    thumbnail,
    isVideo,
    likes: toInt(
      pick(item, ["like_count", "likes", "edge_liked_by.count", "edge_media_preview_like.count"])
    ),
    comments: toInt(
      pick(item, ["comment_count", "comments", "edge_media_to_comment.count"])
    ),
    views: toInt(pick(item, ["play_count", "view_count", "video_view_count", "ig_play_count"])),
    takenAt: (() => {
      const ts = pick(item, ["taken_at", "taken_at_timestamp", "device_timestamp"]);
      const n = Number(ts);
      // Instagram timestamps are seconds; normalise to ISO for the frontend.
      return Number.isFinite(n) && n > 0 ? new Date(n * 1000).toISOString() : null;
    })(),
    permalink: shortcode
      ? `https://www.instagram.com/p/${shortcode}/`
      : `https://www.instagram.com/${IG_USERNAME}/`,
  };
}

/* ------------------------------- requests -------------------------------- */

/** POST the username under every plausible key (body + query) in one request. */
async function callEndpoint(path) {
  const body = new URLSearchParams();
  const query = new URLSearchParams();
  for (const key of USERNAME_KEYS) {
    body.append(key, IG_USERNAME);
    query.append(key, IG_USERNAME);
  }
  const { data } = await ig.post(`${path}?${query.toString()}`, body.toString());

  // The upstream returns HTTP 200 with an `{ error }` body for bad input /
  // quota issues - surface that as a thrown error so the cache never stores it.
  if (data && typeof data === "object" && data.error && !findPostsArray(data).length) {
    const err = new Error(String(data.error));
    err.code = "IG_UPSTREAM";
    err.statusCode = /quota/i.test(data.error) ? 429 : 502;
    throw err;
  }
  return data;
}

/**
 * Fetch profile + recent posts in a single upstream call (quota-friendly).
 * The posts endpoint embeds the owner object, so one request powers both the
 * profile stat band and the media grid.
 */
export async function getInstagramFeed() {
  if (!configured) throw new NotConfiguredError();

  return cache.wrap("instagram:feed", TTL.posts, async () => {
    const data = await callEndpoint(ENDPOINTS.posts);
    const profile = normalizeProfile(data);
    const posts = findPostsArray(data)
      .map(normalizePost)
      .filter((p) => p && p.thumbnail);

    // If the posts endpoint didn't carry post-count, infer a sensible minimum.
    if (!profile.posts && posts.length) profile.posts = posts.length;

    return { profile, posts };
  });
}

export default { getInstagramFeed };
