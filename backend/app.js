import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.js";
import relationshispRouter from "./routes/relationships.js";
import usersRouter from "./routes/users.js";
import { authentication } from "./middleware/authMiddleware.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", authRouter);
app.use("/relationships", authentication, relationshispRouter);
app.use("/users", authentication, usersRouter);

app.listen(PORT, () => {
  console.log(`server is running on: http://localhost:${PORT}`);
});
