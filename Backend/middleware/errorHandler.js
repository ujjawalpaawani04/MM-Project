import axios from "axios";
import { env } from "../config/env.js";

/** 404 for any unmatched route. */
export function notFound(req, res) {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

/**
 * Central error handler. Translates upstream/axios failures into safe client
 * responses and logs the real cause server-side. Crucially, it never echoes
 * the YouTube API key or raw upstream body back to the browser.
 */
// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
export function errorHandler(err, req, res, next) {
  const isAxios = axios.isAxiosError(err);
  const upstreamStatus = isAxios ? err.response?.status : undefined;

  // Map common upstream failures to meaningful client-facing messages.
  let status = 500;
  let message = "Something went wrong while loading community content.";

  if (err.code === "IG_NOT_CONFIGURED" || err.statusCode === 503) {
    status = 503;
    message = "Instagram content is temporarily unavailable.";
  } else if (
    err.statusCode === 429 ||
    upstreamStatus === 429 ||
    /quota/i.test(err.message || "")
  ) {
    // RapidAPI / YouTube daily-or-monthly quota exhausted.
    status = 429;
    message =
      "We've hit our hourly limit for fetching social content. Please check back a little later.";
  } else if (err.code === "IG_UPSTREAM" || err.statusCode === 502) {
    status = 502;
    message = "We couldn't reach Instagram right now. Please try again later.";
  } else if (upstreamStatus === 403) {
    status = 502;
    message =
      "The social API quota was exceeded or the API key is invalid. Please try again later.";
  } else if (upstreamStatus === 404) {
    status = 502;
    message = "The requested resource could not be found.";
  } else if (err.code === "ECONNABORTED") {
    status = 504;
    message = "The upstream service took too long to respond. Please try again.";
  }

  // Log full detail server-side only.
  console.error(
    `[error] ${req.method} ${req.originalUrl} ->`,
    isAxios
      ? `upstream ${upstreamStatus}: ${JSON.stringify(
          err.response?.data?.error?.message || err.message
        )}`
      : err.stack || err.message
  );

  const body = { error: message };
  if (env.nodeEnv === "development") body.detail = err.message;
  res.status(status).json(body);
}
