import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

const router = express.Router();

//UPDATE USER
router.put(
  "/update/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.passowrd) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: req.body,
        },
        { new: true }
      );
    } catch (error) {
      next(error);
    }
  }
);

export default router;
