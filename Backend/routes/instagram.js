import { Router } from "express";
import { getInstagram } from "../controllers/instagramController.js";

const router = Router();

// Public profile + recent posts/reels for the Community Instagram tab.
router.get("/", getInstagram);

export default router;
