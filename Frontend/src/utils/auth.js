/**
 * Front-end-only authentication data layer (no backend).
 *
 * Simulates a real account system entirely in localStorage:
 *   - a multi-user registry (`mm-users`) of account records,
 *   - salted, hashed passwords (plaintext is NEVER stored or exposed),
 *   - a session token (`mm-session`) with expiry + "remember me",
 *   - a "logout everywhere" mechanism via a per-user token version,
 *   - a simulated OTP reset flow (`mm-reset:<email>`).
 *
 * This module is pure (no React) so the same surface can be swapped for real
 * API calls later without touching the UI. Every read is corruption-tolerant:
 * malformed JSON degrades to an empty/blank value instead of throwing.
 *
 * SECURITY NOTE: localStorage is inherently readable on the device, so the
 * hashing here is obfuscation appropriate to a demo - it guarantees we never
 * persist or render a plaintext password, not cryptographic protection.
 */

const USERS_KEY = "mm-users";
const SESSION_KEY = "mm-session";
const RESET_PREFIX = "mm-reset:";

const DAY = 24 * 60 * 60 * 1000;
const REMEMBER_TTL = 30 * DAY; // "Remember me" keeps you signed in for a month.
const SESSION_TTL = 1 * DAY; //   Otherwise the session lasts a day.
const OTP_TTL = 10 * 60 * 1000; // Reset codes expire after 10 minutes.
const HASH_ROUNDS = 600; //        Key-stretching iterations.

/* Per-user namespaced keys created elsewhere in the app. Removing an account
 * wipes exactly these (and nothing belonging to other users). */
const NAMESPACED_PREFIXES = [
  "mm-cart:",
  "mm-wishlist:",
  "mm-addresses:",
  "mm-profile:",
  "mm-recent:",
];
const ORDERS_KEY = "mm-orders";

/* ------------------------------------------------------------------ helpers */

export const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

const safeArray = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeObject = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

/** cyrb53 string hash → 53-bit number rendered as hex. Deterministic + fast. */
function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

/** Salted, key-stretched password hash. */
function hashPassword(password, salt) {
  let acc = `${salt}:${password}`;
  for (let i = 0; i < HASH_ROUNDS; i++) acc = cyrb53(acc, i);
  return acc;
}

const makeSalt = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const makeId = () =>
  `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/* -------------------------------------------------------------- user store */

export function readUsers() {
  if (!hasStorage()) return [];
  return safeArray(window.localStorage.getItem(USERS_KEY));
}

function writeUsers(users) {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
}

export function findUserByEmail(email) {
  const target = normalizeEmail(email);
  if (!target) return null;
  return readUsers().find((u) => normalizeEmail(u.email) === target) || null;
}

export function emailExists(email) {
  return !!findUserByEmail(email);
}

/** Strip secrets - the only shape the UI ever sees. */
export function publicUser(record) {
  if (!record) return null;
  const { passwordHash, salt, ...safe } = record;
  void passwordHash;
  void salt;
  return safe;
}

/* ---------------------------------------------------------------- register */

export function registerUser({ name, email, password }) {
  const cleanEmail = normalizeEmail(email);
  const cleanName = String(name || "").trim();
  if (!cleanName) return { ok: false, error: "Please enter your name." };
  if (!cleanEmail) return { ok: false, error: "Please enter your email." };
  if (!password || password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };
  if (emailExists(cleanEmail))
    return {
      ok: false,
      error: "An account with this email already exists. Try signing in.",
    };

  const salt = makeSalt();
  const record = {
    id: makeId(),
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash: hashPassword(password, salt),
    avatar: null,
    verified: true, // demo accounts are treated as verified
    tokenVersion: 1,
    createdAt: Date.now(),
  };

  const users = readUsers();
  users.push(record);
  if (!writeUsers(users))
    return { ok: false, error: "Storage is unavailable. Please try again." };

  return { ok: true, user: publicUser(record) };
}

/* ------------------------------------------------------------- credentials */

export function verifyCredentials(email, password) {
  const record = findUserByEmail(email);
  if (!record)
    return { ok: false, error: "No account found with this email." };
  if (record.passwordHash !== hashPassword(password, record.salt))
    return { ok: false, error: "Incorrect password. Please try again." };
  return { ok: true, user: publicUser(record) };
}

/** Patch identity fields (name / avatar / verified). Returns the public user. */
export function updateUser(email, patch = {}) {
  const target = normalizeEmail(email);
  const users = readUsers();
  const idx = users.findIndex((u) => normalizeEmail(u.email) === target);
  if (idx === -1) return { ok: false, error: "Account not found." };

  const allowed = {};
  if (typeof patch.name === "string" && patch.name.trim())
    allowed.name = patch.name.trim();
  if ("avatar" in patch) allowed.avatar = patch.avatar || null;
  if (typeof patch.verified === "boolean") allowed.verified = patch.verified;

  users[idx] = { ...users[idx], ...allowed };
  writeUsers(users);
  return { ok: true, user: publicUser(users[idx]) };
}

export function changePassword(email, currentPassword, newPassword) {
  const record = findUserByEmail(email);
  if (!record) return { ok: false, error: "Account not found." };
  if (record.passwordHash !== hashPassword(currentPassword, record.salt))
    return { ok: false, error: "Your current password is incorrect." };
  if (!newPassword || newPassword.length < 6)
    return { ok: false, error: "New password must be at least 6 characters." };
  if (record.passwordHash === hashPassword(newPassword, record.salt))
    return {
      ok: false,
      error: "New password must be different from the current one.",
    };
  return setPassword(email, newPassword);
}

/** Force-set a password (used by the reset flow). */
export function setPassword(email, newPassword) {
  const target = normalizeEmail(email);
  const users = readUsers();
  const idx = users.findIndex((u) => normalizeEmail(u.email) === target);
  if (idx === -1) return { ok: false, error: "Account not found." };
  const salt = makeSalt();
  users[idx] = {
    ...users[idx],
    salt,
    passwordHash: hashPassword(newPassword, salt),
  };
  writeUsers(users);
  return { ok: true, user: publicUser(users[idx]) };
}

/* -------------------------------------------------------- account deletion */

/** Remove an account AND every piece of data namespaced to it. Other users
 *  are left completely untouched. */
export function deleteUser(email) {
  const target = normalizeEmail(email);
  if (!target) return { ok: false, error: "Account not found." };

  const users = readUsers().filter((u) => normalizeEmail(u.email) !== target);
  writeUsers(users);

  if (hasStorage()) {
    try {
      // Namespaced per-user buckets.
      for (const prefix of NAMESPACED_PREFIXES)
        window.localStorage.removeItem(`${prefix}${target}`);
      // The user's password-reset code, if any.
      window.localStorage.removeItem(`${RESET_PREFIX}${target}`);
      // Orders share one key, filtered by the checkout email.
      const orders = safeArray(window.localStorage.getItem(ORDERS_KEY)).filter(
        (o) => normalizeEmail(o?.customer?.email) !== target
      );
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* best-effort cleanup - account record is already gone */
    }
  }
  clearSession();
  return { ok: true };
}

/* ----------------------------------------------------------------- session */

export function createSession(email, remember = false) {
  const target = normalizeEmail(email);
  const record = findUserByEmail(target);
  if (!record) return null;
  const now = Date.now();
  const session = {
    email: target,
    remember: !!remember,
    tokenVersion: record.tokenVersion || 1,
    issuedAt: now,
    expiresAt: now + (remember ? REMEMBER_TTL : SESSION_TTL),
  };
  if (hasStorage()) {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* ignore - in-memory auth still works for this tab */
    }
  }
  return session;
}

export function readSession() {
  if (!hasStorage()) return null;
  return safeObject(window.localStorage.getItem(SESSION_KEY));
}

export function clearSession() {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Resolve the current session to a public user, or null. Returns null (and
 * clears the session) when it is missing, expired, points at a deleted account,
 * or was invalidated by "log out everywhere".
 */
export function restoreSession() {
  const session = readSession();
  if (!session?.email) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) {
    clearSession();
    return null;
  }
  const record = findUserByEmail(session.email);
  if (!record) {
    clearSession();
    return null;
  }
  if ((session.tokenVersion || 1) !== (record.tokenVersion || 1)) {
    clearSession();
    return null;
  }
  return publicUser(record);
}

/** Invalidate every existing session for this user (simulated remote logout). */
export function logoutEverywhere(email) {
  const target = normalizeEmail(email);
  const users = readUsers();
  const idx = users.findIndex((u) => normalizeEmail(u.email) === target);
  if (idx === -1) return { ok: false, error: "Account not found." };
  users[idx] = { ...users[idx], tokenVersion: (users[idx].tokenVersion || 1) + 1 };
  writeUsers(users);
  clearSession();
  return { ok: true };
}

/* --------------------------------------------------------------- OTP reset */

/**
 * Create a 6-digit reset code for an existing account. Returns the code so the
 * UI can display it (simulating the email that would carry it). Always returns
 * ok:false for unknown emails - but callers should show a neutral message to
 * avoid leaking which emails are registered.
 */
export function createResetCode(email) {
  const target = normalizeEmail(email);
  if (!emailExists(target))
    return { ok: false, error: "No account found with this email." };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const payload = { code, expiresAt: Date.now() + OTP_TTL };
  if (hasStorage()) {
    try {
      window.localStorage.setItem(
        `${RESET_PREFIX}${target}`,
        JSON.stringify(payload)
      );
    } catch {
      return { ok: false, error: "Storage is unavailable. Please try again." };
    }
  }
  return { ok: true, code };
}

export function verifyResetCode(email, code) {
  const target = normalizeEmail(email);
  const payload = hasStorage()
    ? safeObject(window.localStorage.getItem(`${RESET_PREFIX}${target}`))
    : null;
  if (!payload) return { ok: false, error: "Request a new code to continue." };
  if (Date.now() > payload.expiresAt) {
    window.localStorage.removeItem(`${RESET_PREFIX}${target}`);
    return { ok: false, error: "This code has expired. Request a new one." };
  }
  if (String(code).trim() !== payload.code)
    return { ok: false, error: "Incorrect code. Please check and try again." };
  return { ok: true };
}

/** Verify the code then set the new password and consume the code. */
export function resetPasswordWithCode(email, code, newPassword) {
  const check = verifyResetCode(email, code);
  if (!check.ok) return check;
  if (!newPassword || newPassword.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };
  const result = setPassword(email, newPassword);
  if (result.ok && hasStorage()) {
    try {
      window.localStorage.removeItem(`${RESET_PREFIX}${normalizeEmail(email)}`);
    } catch {
      /* ignore */
    }
    logoutEverywhere(email); // a reset signs out every existing session
  }
  return result;
}
