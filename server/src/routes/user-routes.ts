import express from "express";
import { demoUser, login, signup } from "../controllers/User.js";
import { UserMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", signup);
router.post("/demo", demoUser);
export default router;
