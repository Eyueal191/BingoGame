import express from "express";
import { signup, login, checkAuth } from "../controllers/authController.js";
const router = express.Router();
// SIGNUP endpoint.
router.post("/signup", signup);
// LOGIN endpoint.
router.post("/login", login);
// Check AuthEndPoint.
router.get("/check-auth", checkAuth);
export default router;
