import axios from "axios";

/**
 * Shared axios instance for talking to our own backend.
 *
 * The base URL comes from VITE_API_URL so it can point at the deployed API in
 * production, and falls back to the local Express server in development. No
 * third-party API keys ever live in the frontend - the backend proxies those.
 */
const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://mm-project-gd6l.onrender.com";

export const api = axios.create({
  baseURL,
  // Generous timeout: the API is hosted on Render's free tier, which cold-starts
  // (the instance spins down when idle) and can take 30–50s to answer the first
  // request. A short timeout would surface that cold start as a "failed to load"
  // error, so we wait it out and let the loading skeletons cover the gap.
  timeout: 45_000,
});

export default api;
