import express, { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { CustomError } from "../middleware/error";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

//REGISTRATION
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        throw new CustomError(400, "User already exists");
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      res.status(201).json({ user: savedUser });
    } catch (error) {
      next(error);
    }
  }
);

//LOGIN
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new CustomError(400, "User not found");
        return;
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        throw new CustomError(401, "Invalid credentials");
        return;
      }
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
      );
      res.cookie("token", token).status(200).json({
        token: token,
        userID: user._id,
        message: "Log in successfull!",
      });
    } catch (error) {
      next(error);
    }
  }
);

//LOGOUT
router.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .clearCookie("token")
        .status(200)
        .json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
);

//FETCH CURRENT USER
router.get(
  "/refetch",
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      const id = (decoded as JwtPayload).id;
      const user = await User.findById(id);
      if (!user) {
        throw new CustomError(404, "User not found!");
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
