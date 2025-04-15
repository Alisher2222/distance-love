import express from "express";
import {
  createWish,
  deleteWish,
  getWishes,
} from "../controllers/wishesController.js";

const router = express.Router();

router.get("/getWishes", getWishes);
router.post("/createWish", createWish);
router.delete("/deleteWish", deleteWish);

export default router;
