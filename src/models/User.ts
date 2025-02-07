import mongoose, { Schema } from "mongoose";
import { UserType } from "../types/types";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
