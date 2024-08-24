import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import {
  User,
  UserPassword,
  UserRank,
  QuizSummary,
  UserPersonalDetail,
  PremuimQuizSummary,
} from "../db/indexDb.js";
import authenticationJWT from "../middleware/auth.js";
import multer from "multer";

const upload = multer();
dotenv.config();

const userRoute = express.Router();
const saltValue = parseInt(process.env.SALT_VALUE);
const SecurityKey = process.env.SecurityKey;
const CloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const CloudinarySecretKey = process.env.CLOUDINARY_SECRET_KEY;
const cloudName = process.env.CLOUDINARY_NAME;

cloudinary.config({
  cloud_name: cloudName,
  api_key: CloudinaryApiKey,
  api_secret: CloudinarySecretKey,
});

// get cloudinary photo link route:
userRoute.post("/imageUrlGen", upload.single("image"), async (req, res) => {
  try {
    const imgData = req.file.buffer;

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((err, uploadResult) => {
          if (err) {
            reject(err);
          } else {
            resolve(uploadResult);
          }
        })
        .end(imgData);
    });

    res.json({ message: "File uploaded successfully", imageUrl: response.url });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.json({ message: "Image upload failed", error: err.message });
  }
});

// about me:
userRoute.get("/me", authenticationJWT, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    res.json({
      message: "Logged in",
      username: req.user.username,
      userId: req.user.userId,
      profilePicture: req.user.profilePicture,
      isPremiumUser: user.premiumUser,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

// signup route:
userRoute.post("/signup", async (req, res) => {
  const { username, password, email, phoneNumber, profilePicture } = req.body;

  if (!username || !password || !email || !phoneNumber) {
    return res.json({
      message:
        "Fail to Signup, Something is missing {username,password,email,phone_number are mandatory }",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }, { phoneNumber }],
  });

  if (existingUser) {
    let message = "User with the given ";

    if (existingUser.email === email) {
      message += "email ";
    } else if (existingUser.username === username) {
      message += "username ";
    } else if (existingUser.phoneNumber === phoneNumber) {
      message += "phone number ";
    }

    message += "is already registered.";

    return res.json({ message });
  }

  try {
    const newUserRank = new UserRank({
      currentRank: 0,
      totalScore: 0,
      minRank: 0,
    });
    const newPersonalDetail = new UserPersonalDetail({});

    await newPersonalDetail.save();

    await newUserRank.save();

    const newUser = new User({
      username,
      email,
      profilePicture,
      phoneNumber,
      premiumUser: false,
      rankings: newUserRank._id,
      personalDetails: newPersonalDetail._id,
    });
    await newUser.save();

    const newQuizSummary = new QuizSummary({
      userId: newUser._id,
      numberOfQuiz: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
    });

    await newQuizSummary.save();

    const salt = await bcrypt.genSaltSync(saltValue);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPassword = new UserPassword({
      userId: newUser._id,
      passwordHash: hashedPassword,
    });

    await newPassword.save();

    const token = jwt.sign(
      {
        username,
        email,
        profilePicture: newUser.profilePicture,
        userId: newUser._id,
      },
      SecurityKey,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Successfully Signed Up",
      token,
      userId: newUser._id,
      profilePicture: newUser.profilePicture,
      username: newUser.username,
      isPremiumUser: newUser.premiumUser,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

// login route:
userRoute.post("/login", async (req, res) => {
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

    const check = await bcrypt.compare(password, hashedPassword.passwordHash);

    if (!check) {
      return res.json({
        message: "email or password doesn't match",
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email,
        profilePicture: user.profilePicture,
        userId: user._id,
      },
      SecurityKey,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Successfully loged in",
      token,
      userId: user._id,
      profilePicture: user.profilePicture,
      username: user.username,
      isPremiumUser: user.premiumUser,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

userRoute.get("/profile/:username", async (req, res) => {
  const uname = req.params.username;
  const user = await User.findOne({ username: uname }).populate([
    "personalDetails",
    "rankings",
  ]);

  if (user) {
    return res.json({
      message: "User Found successfully",
      details: {
        userId: user._id,
        username: user.username,
        isPremiumUser: user.premiumUser,
        personalDetails: user.personalDetails,
        rankings: user.rankings,
        profilePicture: user.profilePicture,
      },
    });
  }

  res.json({
    message: "User not found/exist",
  });
});

userRoute.post("/purchasePremuim", authenticationJWT, async (req, res) => {
  const username = req.user.username;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "User not found",
      });
    }
    const check = await PremuimQuizSummary.findOne({ userId: user._id });

    const currTime = new Date();
    let time = currTime.getTime();

    let newSubExpireTime =
      Math.max(time, user.subscriptionExpireTime) + 30 * 24 * 60 * 60 * 1000;

    user.subscriptionExpireTime = newSubExpireTime;
    user.premiumUser = true;

    await user.save();
    if (!check) {
      const newPremiumSummary = new PremuimQuizSummary({
        userId: user._id,
      });
      await newPremiumSummary.save();
    }

    res.json({
      message: "Successfully purchased premuim",
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

userRoute.get("/getQuizzesSummary/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.json({
      message: "UserId is required Field",
    });
  }
  try {
    const [normalQuizSummary, premiumQuizSummary] = await Promise.all([
      QuizSummary.findOne({ userId }),
      PremuimQuizSummary.findOne({ userId }),
    ]);

    if (!normalQuizSummary) {
      return res.json({
        message: "normalQuizSumary not found",
      });
    }
    if (!premiumQuizSummary) {
      return res.json({
        message: "premiumQuizSummary not found",
      });
    }

    res.json({
      message: "Quiz Summary Send Successfully",
      normalQuizSummary,
      premiumQuizSummary,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});
export default userRoute;
