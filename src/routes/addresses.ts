import express, { Request, Response, NextFunction } from "express";
import Address from "../models/Address";
import { CustomError } from "../middleware/error";

const router = express.Router();

// CREATE ADDRESS
router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const newAddress = new Address(req.body);
    try {
      const savedAddress = await newAddress.save();
      res.status(201).json(savedAddress);
    } catch (error) {
      next(error);
    }
  }
);

//UPDATE ADDRESS
router.put(
  "/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!updatedAddress) {
        res.status(404).json({ message: "Address not found" });
        throw new CustomError(404, "Address not found");
      }
      res.status(200).json(updatedAddress);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE ADDRESS
router.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const addressToDelet = await Address.findByIdAndDelete(id);
      if (!addressToDelet) {
        res.status(404).json({ message: "Address not found" });
        throw new CustomError(404, "Address not found");
      }
      res.status(204).json({ message: "Address deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

// GET ALL USER ADDRESSES
router.get(
  "/all/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const allAddresses = await Address.find({ user: userId });
      if (allAddresses.length === 0) {
        res.status(404).json({ message: "No address found" });
        throw new CustomError(404, "No address found");
      }
      res.status(200).json(allAddresses);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
