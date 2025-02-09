import express, { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import { CustomError } from "../middleware/error";

const router = express.Router();

// CREATE ORDER
router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const orderDetails = new Order(req.body);
    try {
      const savedOrder = await orderDetails.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      next(error);
    }
  }
);

// UPDATE ORDER
router.put(
  "/update/:orderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    try {
      const orderToUpdate = await Order.findByIdAndUpdate(
        orderId,
        { $set: req.body },
        { new: true }
      );
      if (!orderToUpdate) {
        res.status(404).json({ message: "Order not found" });
        throw new CustomError(404, "Order not found");
      }
      res.status(200).json(orderToUpdate);
    } catch (error) {
      next(error);
    }
  }
);

//CANCEL ORDER
router.delete(
  "/delete/:orderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        res.status(404).json({ message: "Order not found" });
        throw new CustomError(404, "Order not found");
      }
      res.status(200).json({ message: "Order canceled successfully" });
    } catch (error) {
      next(error);
    }
  }
);

//GET ALL ORDERS
router.get(
  "/all/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      const userOrders = await Order.find({ user: userId }).populate("address");
      if (userOrders.length === 0) {
        res.status(404).json({ message: "No orders found" });
        throw new CustomError(404, "No orders found");
      }
      res.status(200).json(userOrders);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
