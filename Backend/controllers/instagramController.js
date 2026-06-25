import { getInstagramFeed } from "../services/instagramService.js";

/**
 * Thin controller for the Community page's Instagram tab. Returns the public
 * profile (stats + bio) and the recent media grid in one payload, so the
 * frontend makes a single request. Errors bubble to the central handler, which
 * keeps the RapidAPI key and raw upstream bodies out of client responses.
 */

// GET /api/instagram
export async function getInstagram(req, res, next) {
  try {
    const data = await getInstagramFeed();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
