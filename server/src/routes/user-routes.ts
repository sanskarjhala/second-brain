import express from "express";
import { getUserProfile, login, signup } from "../controllers/User.js";
import { UserMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", signup);
router.get("/get-user-profile", UserMiddleware, getUserProfile);

export default router;
