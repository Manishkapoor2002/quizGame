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

// bug(not saving correct birthday date )
// settingRouter.post("/DOB", authenticationJWT, async (req, res) => {
//   const { DOB } = req.body;

//   if (!DOB) {
//     return res.json({
//       message: "DOB is a required field",
//     });
//   }

//   try {
//     const user = await User.findOne({ username: req.user.username }).populate("personalDetails");

//     if (!user) {
//       return res.json({
//         message: "User not found!",
//       });
//     }

//     const personalDetails = user.personalDetails;

//     if (!personalDetails) {
//       return res.json({
//         message: "Personal details not found!",
//       });
//     }

//     // Ensure DOB is a valid date
//     const dobDate = new Date(DOB);
//     if (isNaN(dobDate.getTime())) {
//       return res.json({
//         message: "Invalid date format for DOB",
//       });
//     }

//     personalDetails.DOB = dobDate;
//     await personalDetails.save();

//     return res.status(200).json({
//       message: "Updated successfully",
//     });
//   } catch (err) {
//     console.error("Error updating DOB:", err);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// });

settingRouter.post("/Gender", authenticationJWT, async (req, res) => {
  const { Gender } = req.body;

  if (!Gender) {
    return res.status(400).json({
      message: "Gender is a required field",
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

    personalDetails.Gender = Gender;
    await personalDetails.save();

    return res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Error updating DOB:", err);
    return res.json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

settingRouter.post("/location", authenticationJWT, async (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.json({
      message: "location is a required field",
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

    personalDetails.location = location;
    await personalDetails.save();

    return res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Error updating DOB:", err);
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
  console.log(key,value)

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
