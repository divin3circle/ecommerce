import mongoose, { Schema } from "mongoose";
import { CartType } from "../types/types";

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
});

const Cart = mongoose.model<CartType>("Cart", cartSchema);

export default Cart;
