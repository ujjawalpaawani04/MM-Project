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
  timeout: 12_000,
});

export default api;
