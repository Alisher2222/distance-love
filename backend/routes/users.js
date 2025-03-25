import express from "express";
import { authentication } from "../middleware/authMiddleware.js";
import { getUserData } from "../controllers/usersController.js";

const router = express.Router();

router.get("/:id", authentication, getUserData);

export default router;
