import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { authentication } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authentication, logout);

export default router;
