import { IUser, User } from "../models/user.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
class UserController {
  async create(req: Request, res: Response) {
    const { username, email, password, role } = req.body;
    console.log(req.body);
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required" });
    }
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "username or email already exists" });
    }
    try {
      const user = new User({
        username,
        email,
        password,
        role: role || "user",
      });
      await user.save();
      return res
        .status(201)
        .json({ message: "user create successfully", user });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({}, { password: 0 });
      if (users.length === 0) {
        return res.status(404).json({ message: "No user found" });
      }
      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
  async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User id is required" });
    //if not valid id object, return error
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const { username, email, password } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password;
      await user.save();
      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      const accessToken = jwt.sign(
        { userData: userWithoutPassword },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .cookie("Authorization", accessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Authorized",
          user: userWithoutPassword,
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
}
export default new UserController();
