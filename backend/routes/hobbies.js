import express from "express";
import { getHobbies } from "../controllers/hobbiesController.js";

const router = express.Router();
console.log("hello 1");
router.get("/getHobbies", getHobbies);

export default router;
