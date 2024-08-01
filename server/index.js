import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.js";
const app = express();
dotenv.config();
const port = process.env.Port;
const url = process.env.Mongodb_URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/user", userRoute);

mongoose.connect(url);

app.listen(3000, () => {
  console.log(`Running on port number ${port} successfully!`);
});
