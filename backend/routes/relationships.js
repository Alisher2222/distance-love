import {
  createRelationship,
  deleteRelationship,
  getRelationshipData,
} from "../controllers/relationshipsController.js";
import express from "express";

const router = express.Router();

router.post("/createRelationship", createRelationship);
router.delete("/deleteRelationship", deleteRelationship);
router.get("/getRelationshipData", getRelationshipData);

export default router;
