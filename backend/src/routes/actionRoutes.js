import express from "express";
import { getLast20Actions } from "../controllers/actionController.js";
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/last-20", protectRoute, getLast20Actions);

export default router;
