/**
 * Frontend-only form sinks (no backend).
 *
 * Newsletter sign-ups and contact requests are persisted to localStorage so
 * submissions aren't silently dropped. Living in a plain module (not a
 * component) keeps timestamp/side-effect code out of render and lets a real API
 * replace these calls later without touching the UI.
 */

const NEWSLETTER_KEY = "mm-newsletter";
const CONTACT_KEY = "mm-contact-requests";
const PROFILE_PREFIX = "mm-profile:";
const MAX_CONTACT_REQUESTS = 50;

const safeArray = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Persist a newsletter sign-up. Returns "added" for a new email,
 * "exists" if already subscribed, or "error" if storage is unavailable.
 */
export function subscribeToNewsletter(rawEmail) {
  const email = String(rawEmail || "").trim().toLowerCase();
  if (!email) return "error";
  try {
    const subscribers = safeArray(window.localStorage.getItem(NEWSLETTER_KEY));
    if (subscribers.includes(email)) return "exists";
    window.localStorage.setItem(
      NEWSLETTER_KEY,
      JSON.stringify([...subscribers, email])
    );
    return "added";
  } catch {
    return "error";
  }
}

/**
 * Persist a contact request (newest first, capped). The non-serialisable file
 * reference is dropped. Returns true on success, false if storage is unavailable.
 */
export function saveContactRequest({ reference, ...fields }) {
  void reference; // File objects can't be serialised - intentionally discarded.
  try {
    const requests = safeArray(window.localStorage.getItem(CONTACT_KEY));
    requests.unshift({ ...fields, submittedAt: Date.now() });
    window.localStorage.setItem(
      CONTACT_KEY,
      JSON.stringify(requests.slice(0, MAX_CONTACT_REQUESTS))
    );
    return true;
  } catch {
    return false;
  }
}

const safeObject = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

/**
 * Per-user profile extras (phone, gender, dob, ...) kept alongside the auth
 * session without modifying it. Keyed by email so each account is isolated.
 */
export function getProfile(email) {
  const key = String(email || "").trim().toLowerCase();
  if (!key || typeof window === "undefined") return {};
  return safeObject(window.localStorage.getItem(`${PROFILE_PREFIX}${key}`));
}

export function saveProfile(email, data) {
  const key = String(email || "").trim().toLowerCase();
  if (!key) return false;
  try {
    window.localStorage.setItem(
      `${PROFILE_PREFIX}${key}`,
      JSON.stringify({ ...getProfile(key), ...data })
    );
    return true;
  } catch {
    return false;
  }
}

const ADDRESS_PREFIX = "mm-addresses:";
const addressKey = (email) =>
  `${ADDRESS_PREFIX}${String(email || "").trim().toLowerCase()}`;

/** Saved delivery addresses for a user (first entry is treated as default). */
export function getAddresses(email) {
  if (!email || typeof window === "undefined") return [];
  return safeArray(window.localStorage.getItem(addressKey(email)));
}

export function saveAddresses(email, addresses) {
  if (!email) return false;
  try {
    window.localStorage.setItem(addressKey(email), JSON.stringify(addresses));
    return true;
  } catch {
    return false;
  }
}
