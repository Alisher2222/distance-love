import { createRelationshipHistory } from "../controllers/relationshipHistoriesController.js";
import {
  createRelationship,
  getAllRequests,
  getRelationshipData,
  getRelationshipId,
  rejectRequest,
  sendRequest,
} from "./../controllers/relationshipsController.js";
import express from "express";

const router = express.Router();
router.post("/sendRequest", sendRequest);
router.post("/createRelationship", createRelationship);
router.post("/rejectRequest", rejectRequest);
router.post("/createRelationshipHistory", createRelationshipHistory);
router.get("/getRelationshipId", getRelationshipId);
router.get("/getAllRequests", getAllRequests);
router.get("/getRelationshipData", getRelationshipData);
export default router;
