import express from "express";
import connectDB from "./database/connectDb";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import userRoute from "./routes/users";
import cookieParser from "cookie-parser";
import verifyToken from "./middleware/verifyToken";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", verifyToken, userRoute);

// app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
