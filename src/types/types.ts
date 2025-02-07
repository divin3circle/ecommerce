import mongoose from "mongoose";

export type UserType = {
  name: string;
  email: string;
  password: string;
};

export type ProductType = {
  name: string;
  price: number;
  description: string;
  bannerImage: string;
  images: string[];
  rating: number;
  category: string[];
  color: string[];
  size: string[];
};

export type OrderType = {
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  status: string;
  address: mongoose.Types.ObjectId;
};

export type CartType = {
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
};

export type WishlistType = {
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
  }[];
};

export type AddressType = {
  user: mongoose.Types.ObjectId;
  adressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  adressLine2?: string;
};
