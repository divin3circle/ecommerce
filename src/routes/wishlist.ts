import express, { Request, Response, NextFunction } from "express";
import Wishlist from "../models/Wishlist";
import { CustomError } from "../middleware/error";

const router = express.Router();

//ADD TO WISHLIST
router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    if (
      wishlist.products.find((item) => item.product.toString() === productId)
    ) {
      res.status(400).json({ message: "Product already in wishlist" });
      throw new CustomError(400, "Product already in wishlist");
    }
    wishlist.products.push({ product: productId });
    const savedWishlist = await wishlist.save();
    res.status(201).json(savedWishlist);
  } catch (error) {
    next(error);
  }
});

// GET WISHLIST
router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      const userWishlist = await Wishlist.findOne({ user: userId }).populate(
        "products.product"
      );
      if (!userWishlist) {
        res.status(404).json({ message: "Wishlist not found" });
        throw new CustomError(404, "Wishlist not found");
      } else {
        res.status(200).json({ wishlist: userWishlist });
      }
    } catch (error) {
      next(error);
    }
  }
);

// REMOVE FROM WISHLIST
router.post(
  "/remove",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.body;
    try {
      const userWishlist = await Wishlist.findOne({ user: userId });
      if (!userWishlist) {
        res.status(404).json({ message: "Wishlist not found" });
        throw new CustomError(404, "Wishlist not found");
      }
      const productIndex = userWishlist.products.findIndex(
        (item) => item.product,
        toString() === productId
      );
      if (productIndex !== -1) {
        userWishlist.products.splice(productIndex, 1);
        const savedWishlist = await userWishlist.save();
        res.status(200).json({
          message: "Product removed from wishlist",
          wishlist: savedWishlist,
        });
      } else {
        res.status(404).json({ message: "Product not found in wishlist" });
        throw new CustomError(404, "Product not found in wishlist");
      }
    } catch (error) {
      next(error);
    }
  }
);

// CLEAR WISHLIST
router.post(
  "/clear",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    try {
      const userWishlist = await Wishlist.findOne({ user: userId });
      if (!userWishlist) {
        res.status(404).json({ message: "Wishlist not found" });
        throw new CustomError(404, "Wishlist not found");
      }
      userWishlist.products = [];
      const savedWishlist = await userWishlist.save();
      res
        .status(200)
        .json({ message: "Wishlist cleared", wishlist: savedWishlist });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
