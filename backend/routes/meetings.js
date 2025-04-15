import express from "express";
import { addMeetings, getMeetings } from "../controllers/meetingController.js";

const router = express.Router();

router.post("/getMeetings", getMeetings);
router.post("/addMeeting", addMeetings);

export default router;
