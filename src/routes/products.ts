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

//SEARCH
router.get(
  "/search/:query",
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.params.query;
    try {
      const productsFound = await Product.find({
        $or: [
          { name: { $regex: new RegExp(query, "i") } },
          { description: { $regex: new RegExp(query, "i") } },
          { catergory: { $regex: new RegExp(query, "i") } },
        ],
      });
      if (productsFound.length === 0) {
        res.status(404).json({ message: "No product was found!" });
        return;
      }
      res.status(200).json(productsFound);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
