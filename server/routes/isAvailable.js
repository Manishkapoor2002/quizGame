import express from "express";
import { User } from "../db/indexDb.js";

const isAvailable = express.Router();
isAvailable.get("/username/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "username is available to use",
      });
    }

    res.json({
      message: "username is in use",
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});
isAvailable.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);

  if (!email) {
    return res.json({
      message: "email is mandatory field",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "email is available to use",
      });
    }
    res.json({
      message: "email is in use",
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});
isAvailable.get("/phone/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;
  if (!phoneNumber) {
    return res.json({
      message: "phone number is required field",
    });
  }
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.json({
        message: "phoneNumber is available to use",
      });
    }

    res.json({
      message: "phoneNumber is in use",
    });
  } catch (err) {
    return res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

export default isAvailable;
