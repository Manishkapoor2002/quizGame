import express, { text } from "express";
import dotenv from "dotenv";
import authenticationJWT from "../middleware/auth.js";
import { User } from "../db/indexDb.js";

const settingRouter = express.Router();

settingRouter.get("/currentSetting", authenticationJWT, async (req, res) => {
  const { username } = req.user;
  try {
    const currentSetting = await User.findOne({ username }).populate("personalDetails");
    if (!currentSetting) {
      return res.json({
        message: "Something went wrong",
      });
    }

    res.json({
      message: "current settings",
      currentSetting
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

export default settingRouter;
