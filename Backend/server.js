import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import youtubeRoutes from "./routes/youtube.js";
import instagramRoutes from "./routes/instagram.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// --- CORS -------------------------------------------------------------------
// Scope to known frontend origins instead of a wildcard. Requests with no
// Origin header (curl, server-to-server, health checks) pass through.
//
// In development we also reflect ANY localhost / 127.0.0.1 origin regardless of
// port (Vite silently bumps to 5174, 5175, … when its default is taken), plus
// private LAN IPs (192.168.x, 10.x, 172.16–31.x) so the app can be opened from
// a phone or another device on the same network. A hard-coded allowlist would
// otherwise reject the browser and surface as a 500. Disallowed origins are
// rejected *cleanly* (no ACAO header) rather than by throwing. This relaxation
// is dev-only - in production only env.clientOrigins is honoured.
const isDevOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
    origin
  );
                                      
app.use(
  cors()
);

app.use(express.json());

// --- Routes -----------------------------------------------------------------
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

app.use("/api/youtube", youtubeRoutes);
app.use("/api/instagram", instagramRoutes);

// --- Errors -----------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(
    `✅ Server running on http://localhost:${env.port} (${env.nodeEnv})`
  );
});
