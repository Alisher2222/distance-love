import express from "express";
import {
  createWishlist,
  deleteWishlist,
  getWishlists,
} from "../controllers/wishlistsController.js";

const router = express.Router();

router.get("/getWishlists", getWishlists);
router.post("/createWishlist", createWishlist);
router.delete("/deleteWishlist", deleteWishlist);

export default router;
