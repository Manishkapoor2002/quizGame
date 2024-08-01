import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User, UserPassword } from "../db/indexDb.js";
dotenv.config();

const userRoute = express.Router();
const saltValue = process.env.SALT_VALUE;
const SecurityKey = process.env.SecurityKey;
// signup route:
userRoute.get("/signup", async (req, res) => {
  const { username, password, email, phone_number, profile_pic } = req.body;

  if (!username || !password || !email || !phone_number) {
    return res.json({
      message:
        "Fail to Signup, Something is missing {username,password,email,phone_number are mandatory }",
    });
  }

  const result = await User.find({ email });
  if (result) {
    return res.json({
      message: "Email is already registered",
    });
  }

  const salt = bcrypt.genSaltSync(saltValue);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const token = jwt.sign({ username, email }, SecurityKey, {
      expiresIn: "7d",
    });

    const newUser = new User({
      username,
      email,
      phone_number,
      profile_pic,
    });

    await newUser.save();

    const newPassword = new UserPassword({
      userId: newUser._id,
      password: hashedPassword,
    });

    await newPassword.save();

    return res.json({
      message: "Successfully Signed Up",
      token,
      userId: newUser._id,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err,
    });
  }
});

// login route:

userRoute.get("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      message: "email and password mandatory for login",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Email is not registered",
      });
    }
    let userId = user._id;
    const hashedPassword = await UserPassword.findOne({ userId });

    if (!hashedPassword) {
      return res.json({
        message: "Something went wrong",
        errorType: "Password is missing in passDB",
      });
    }

    const check = await bcrypt.compare(password, hashedPassword.password);

    if (!check) {
      return res.json({
        message: "email or password doesn't match",
      });
    }

    const token = jwt.sign({ username: user.username, email }, SecurityKey, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Successfully loged in",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err,
    });
  }
});

export default userRoute;
