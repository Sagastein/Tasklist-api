import express, { NextFunction, Request, Response } from "express";
const app = express();
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { UserRouter } from "./routes/user.route";
import { TaskRouter } from "./routes/task.route";
import { errorHandler } from "./middleware/errorHandler";

const port = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());
const main = express.Router();
app.use("/api/v1", main);
main.use("/user", UserRouter);
main.use("/task", TaskRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my server" });
});
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  res.status(404);
  next(err);
});
app.use(errorHandler);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
