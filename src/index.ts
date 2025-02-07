import express from "express";
import connectDB from "./database/connectDb";
import dotenv from "dotenv";
import authRoute from "./routes/auth";

const app = express();

dotenv.config();

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
