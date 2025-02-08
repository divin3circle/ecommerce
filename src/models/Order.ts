import mongoose, { Schema } from "mongoose";
import { OrderType } from "../types/types";

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
    required: true,
  },
  address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
});

const Order = mongoose.model<OrderType>("Order", orderSchema);

export default Order;
