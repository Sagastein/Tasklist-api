import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { UserRouter } from "./routes/user.route";
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());
const main = express.Router();
app.use("/api/v1", main);
main.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my server" });
});
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
