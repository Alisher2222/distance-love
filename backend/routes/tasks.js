import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  toggleTaskCompletion,
} from "../controllers/tasksController.js";

const router = express.Router();

router.post("/createTask", createTask);

router.get("/getTasks", getTasks);

router.delete("/deleteTask/:id", deleteTask);

router.patch("/toggleTaskCompletion/:id", toggleTaskCompletion);

export default router;
