import express, { text } from "express";
import dotenv from "dotenv";
import authenticationJWT from "../middleware/auth.js";
import { User } from "../db/indexDb.js";
import { set } from "mongoose";

const settingRouter = express.Router();

settingRouter.get("/currentSetting", authenticationJWT, async (req, res) => {
  const { username } = req.user;
  try {
    const currentSetting = await User.findOne({ username }).populate(
      "personalDetails"
    );
    if (!currentSetting) {
      return res.json({
        message: "Something went wrong",
      });
    }

    res.json({
      message: "current settings",
      currentSetting,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

settingRouter.post("/basic", authenticationJWT, async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.json({
      message: "key and value are required fields",
    });
  }

  try {
    const user = await User.findOne({ username: req.user.username }).populate(
      "personalDetails"
    );

    if (!user) {
      return res.json({
        message: "User not found!",
      });
    }

    const personalDetails = user.personalDetails;

    if (!personalDetails) {
      return res.json({
        message: "Personal details not found!",
      });
    }

    personalDetails[key] = value;
    await personalDetails.save();

    return res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Error updating social handle:", err);
    return res.json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

settingRouter.post("/socialHandle", authenticationJWT, async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.json({
      message: "key and value are required fields",
    });
  }

  try {
    const user = await User.findOne({ username: req.user.username }).populate(
      "personalDetails"
    );

    if (!user) {
      return res.json({
        message: "User not found!",
      });
    }

    const personalDetails = user.personalDetails;

    if (!personalDetails) {
      return res.json({
        message: "Personal details not found!",
      });
    }

    personalDetails.socialHandles[key] = value;
    await personalDetails.save();

    return res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Error updating social handle:", err);
    return res.json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

settingRouter.post("/education", authenticationJWT, async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return res.json({
      message: "Key and value are required field",
    });
  }
  console.log(key, value);

  try {
    const user = await User.findOne({ username: req.user.username }).populate(
      "personalDetails"
    );
    if (!user) {
      return res.json({
        message: "User not found",
      });
    }
    const personalDetails = user.personalDetails;
    if (!personalDetails) {
      return res.json({
        message: "personalDetails not found",
      });
    }
    personalDetails.education[key] = value;
    await personalDetails.save();
    res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Error updating social handle:", err);
    return res.json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

export default settingRouter;
