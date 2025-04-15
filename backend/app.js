import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.js";
import relationshipsRouter from "./routes/relationships.js";
import hobbiesRouter from "./routes/hobbies.js";
import interstsRouter from "./routes/interests.js";
import freeDaysRouter from "./routes/freeDays.js";
import meetingRouter from "./routes/meetings.js";
import wishlistRouter from "./routes/wishlists.js";
import wishesRouter from "./routes/wishes.js";
import tasksRouter from "./routes/tasks.js";
import { authentication } from "./middleware/authMiddleware.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use("/", authRouter);
app.use("/relationships", authentication, relationshipsRouter);
app.use("/hobbies", hobbiesRouter);
app.use("/interests", authentication, interstsRouter);
app.use("/freeDays", authentication, freeDaysRouter);
app.use("/meetings", authentication, meetingRouter);
app.use("/wishlists", authentication, wishlistRouter);
app.use("/wishes", authentication, wishesRouter);
app.use("/tasks", authentication, tasksRouter);

app.listen(PORT, () => {
  console.log(`server is running on: http://localhost:${PORT}`);
});
