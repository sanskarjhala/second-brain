import express from "express";
import { getUserProfile, login, signup } from "../controllers/User";
import { UserMiddleware } from "../middleware/auth";
const router = express.Router();

router.post("/login", login);
router.post("/register", signup);
router.get("/get-user-profile", UserMiddleware, getUserProfile);

export default router;
