import express, { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { CustomError } from "../middleware/error";

const router = express.Router();

// ADD TO CART
router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, products: [], totalPrice: 0 });
    }
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      console.log("Adding product to cart:", { product: productId, quantity });
      cart.products.push({ product: productId, quantity });
    }
    const productsInCart = await Product.find({
      _id: { $in: cart.products.map((item) => item.product) },
    });
    let totalPrice = 0;
    if (productsInCart.length > 0) {
      productsInCart.forEach((product) => {
        const cartItem = cart.products.find(
          (item) => item.product.toString() === product._id.toString()
        );
        totalPrice += product.price * cartItem.quantity;
      });
    }
    cart.totalPrice = totalPrice;

    // Using aggregation to calculate total price
    // const cartWithTotalPrice = await Cart.aggregate([
    //   { $match: { _id: cart._id } },
    //   { $unwind: "$products" },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "products.product",
    //       foreignField: "_id",
    //       as: "productDetails",
    //     },
    //   },
    //   { $unwind: "$productDetails" },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       totalPrice: {
    //         $sum: {
    //           $multiply: ["$products.quantity", "$productDetails.price"],
    //         },
    //       },
    //       products: { $push: "$products" },
    //     },
    //   },
    // ]);

    // if (cartWithTotalPrice.length > 0) {
    //   cart.totalPrice = cartWithTotalPrice[0].totalPrice;
    //   cart.products = cartWithTotalPrice[0].products;
    // }
    const savedCart = await cart.save();
    res.status(201).json({ message: "Item added to cart!", cart: savedCart });
  } catch (error) {
    next(error);
  }
});

// REMOVE PRODUCT FROM CART
router.post(
  "/remove",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, productId } = req.body;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        throw new Error("Cart not found");
      }
      const updatedCart = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
      if (updatedCart.length === 0) {
        cart.totalPrice = 0;
      }
      cart.products = updatedCart;
      const savedCart = await cart.save();
      res
        .status(200)
        .json({ message: "Product removed from cart", cart: savedCart });
    } catch (error) {
      next(error);
    }
  }
);

//DECRESING QUANTITY OF PRODUCT IN CART
router.post(
  "/delete-item",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.body;
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        throw new CustomError(404, "Cart not found");
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
        } else {
          cart.products.splice(productIndex, 1);
        }
      }
      const savedCart = await cart.save();
      res
        .status(200)
        .json({ message: "Product quantity decreased", cart: savedCart });
    } catch (error) {
      next(error);
    }
  }
);

// GET CART
router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      const userCart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );
      if (!userCart) {
        res.status(404).json({ message: "Cart not found" });
        throw new CustomError(404, "Cart not found");
      }
      res.status(200).json({ cart: userCart });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
