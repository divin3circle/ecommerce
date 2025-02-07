import mongoose, { Schema } from "mongoose";
import { ProductType } from "../types/types";

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  bannerImage: { type: String, required: true },
  images: [{ type: String, required: true }],
  rating: { type: Number, required: true },
  catergory: [{ type: String, required: true }],
  color: [{ type: String, required: false }],
  size: [{ type: String, required: false }],
});

const Product = mongoose.model<ProductType>("Product", productSchema);

export default Product;
