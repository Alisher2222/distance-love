import express from "express";
import {
  addIntersets,
  getInterests,
} from "../controllers/interestsController.js";

const router = express.Router();

router.post("/addInterests", addIntersets);
router.get("/getInterests", getInterests);

export default router;
