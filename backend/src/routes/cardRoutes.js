import express from "express";
import { getCards, reserveCard } from "../controllers/cardController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/",protect , getCards);
router.post("/reserve/:id", protect,reserveCard);

export default router;
