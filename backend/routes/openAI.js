import express from "express";
import { getRecomendations } from "../controllers/openAiController.js";

const router = express();

router.post("/getRecomendations", getRecomendations);

export default router;
