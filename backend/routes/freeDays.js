import express from "express";
import {
  addFreeDays,
  deleteFreeDays,
  getFreeDays,
} from "../controllers/freeDaysController.js";

const router = express.Router();
router.post("/addFreeDays", addFreeDays);
router.post("/deleteFreeDays", deleteFreeDays);
router.get("/getFreeDays", getFreeDays);

export default router;
