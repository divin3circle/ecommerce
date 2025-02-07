import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { CustomError } from "../middleware/error";

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
      const user = await User.findById(req.params.userId);
      if (!user) {
        throw new CustomError(404, "User not found");
        return;
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

//GET DETAILS
router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

export default router;
