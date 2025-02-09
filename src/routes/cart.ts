import express, { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";

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
    // const productsInCart = await Product.find({
    //   _id: { $in: cart.products.map((item) => item.product) },
    // });
    // let totalPrice = 0;
    // productsInCart.forEach((product) => {
    //   const cartItem = cart.products.find(
    //     (item) => item.product.toString() === product._id.toString()
    //   );
    //   totalPrice += product.price * cartItem.quantity;
    // });
    // cart.totalPrice = totalPrice;

    // Using aggregation to calculate total price
    const cartWithTotalPrice = await Cart.aggregate([
      { $match: { _id: cart._id } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$_id",
          totalPrice: {
            $sum: {
              $multiply: ["$products.quantity", "$productDetails.price"],
            },
          },
          products: { $push: "$products" },
        },
      },
    ]);

    if (cartWithTotalPrice.length > 0) {
      cart.totalPrice = cartWithTotalPrice[0].totalPrice;
      cart.products = cartWithTotalPrice[0].products;
    }
    const savedCart = await cart.save();
    res.status(201).json({ message: "Item added to cart!", cart: savedCart });
  } catch (error) {
    next(error);
  }
});

export default router;
