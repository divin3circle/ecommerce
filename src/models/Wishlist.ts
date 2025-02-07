import mongoose, { Schema } from "mongoose";
import { WishlistType } from "../types/types";

const wishlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
  ],
});

const Wishlist = mongoose.model<WishlistType>("Wishlist", wishlistSchema);

export default Wishlist;
