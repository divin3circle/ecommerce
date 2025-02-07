import express, { Request, Response, NextFunction } from "express";
import Product from "../models/Product";

const router = express.Router();

//CREATE PRODUCT(ONLY FOR ADMIN)
router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const newProduct = new Product(req.body);

    try {
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
