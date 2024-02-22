import express from "express";
import userController from "../controllers/user.controller";
import { checkAuth, checkAdmin } from "../middleware/CheckAuth";

const router = express.Router();
router.post("/", userController.create);
router.get("/", checkAuth, checkAdmin, userController.getUsers);
router.post("/login", userController.login);
router.get("/:id", userController.getOneUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
export { router as UserRouter };
