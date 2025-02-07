import express from "express";
import connectDB from "./database/connectDb";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

// app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
