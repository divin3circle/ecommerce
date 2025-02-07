import express, { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import { CustomError } from "../middleware/error";

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

//GET ALL PRODUCTS
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//GET PRODUCTS BY CATEGORY
router.get(
  "/:category",
  async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params;
    try {
      const products = await Product.find({ category });
      if (products.length === 0) {
        res.status(404).json({ message: "No product was found!" });
        throw new CustomError(404, "No product was found!");
        return;
      }
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
);

//GET PRODUCT DETAILS
router.get(
  "/get/:productId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    try {
      const products = await Product.findById(productId);
      if (!products) {
        res.status(404).json({ message: "No product was found!" });
        throw new CustomError(404, "No product was found!");
        return;
      }
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
