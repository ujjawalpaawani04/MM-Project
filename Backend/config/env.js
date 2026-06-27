import dotenv from "dotenv";

dotenv.config();

/**
 * Centralised, validated environment configuration.
 *
 * Reading process.env in exactly one place means a missing/renamed key fails
 * loudly at boot with an actionable message, instead of surfacing as a vague
 * 500 ("Failed to fetch videos") at request time.
 */
const required = ["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID"];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `\n[config] Missing required environment variable(s): ${missing.join(", ")}\n` +
      `Add them to Backend/.env - e.g.\n` +
      `  YOUTUBE_API_KEY=your_api_key\n` +
      `  YOUTUBE_CHANNEL_ID=your_channel_id\n`
  );
  process.exit(1);
}

// Instagram is an optional enhancement, not a hard requirement: if the RapidAPI
// credentials are absent the server still boots and the /api/instagram routes
// simply respond with a clean 503 ("not configured") that the frontend renders
// as a graceful error state - exactly as it would for any upstream failure.
const instagramConfigured = Boolean(
  process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_HOST
);
if (!instagramConfigured) {
  console.warn(
    "[config] RAPIDAPI_KEY / RAPIDAPI_HOST not set - Instagram features disabled."
  );
}

export const env = {
  port: Number(process.env.PORT) || 7000,
  nodeEnv: process.env.NODE_ENV || "development",
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
    channelId: process.env.YOUTUBE_CHANNEL_ID,
  },
  instagram: {
    configured: instagramConfigured,
    rapidApiKey: process.env.RAPIDAPI_KEY,
    rapidApiHost: process.env.RAPIDAPI_HOST,
    // The public handle whose profile + posts power the Community Instagram tab.
    username: process.env.INSTAGRAM_USERNAME || "mohanmaya",
  },
  // Comma-separated list of allowed browser origins for CORS.
  // Defaults cover the common Vite dev ports (5173 + the 5174/5175 it bumps to
  // when 5173 is already taken) and the preview server (4173).
  clientOrigins: (process.env.CLIENT_ORIGINS ||
    "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:5174")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};

export default env;
