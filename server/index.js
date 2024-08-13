import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.js";
import gameRoute from "./routes/game.js";
import isAvailable from "./routes/isAvailable.js";
const app = express();
dotenv.config();
const port = process.env.Port;
const url = process.env.Mongodb_URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes:
app.use("/user", userRoute);
app.use("/game", gameRoute);
app.use("/isAvailable", isAvailable);

mongoose.connect(url);

app.listen(3000, () => {
  console.log(`Running on port number ${port} successfully!`);
});
