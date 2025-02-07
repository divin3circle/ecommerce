import mongoose, { Schema } from "mongoose";
import { AddressType, CartType } from "../types/types";

const addressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  adressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  adressLine2: { type: String, required: false },
});

const Address = mongoose.model<AddressType>("Address", addressSchema);
