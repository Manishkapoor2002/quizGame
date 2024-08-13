import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SecurityKey = process.env.SecurityKey;
const authenticationJWT = (req, res, next) => {
  const authHeader = req.headers.authentication;
  try {
    if (!authHeader) {
      return res.json({
        message: "Authentication header not Found!",
      });
    }
    const userToken = authHeader.split(" ")[1];
    jwt.verify(userToken, SecurityKey, (err, data) => {
      if (err) {
        return res.json({
          message: "Authentication failed",
          error: "Token not match or Expired!",
        });
      }
      req.user = data;
      next();
    });
  } catch (err) {
    res.json({
      message: "Somthing went wrong!",
      errorType: err.message,
    });
  }
};
export default authenticationJWT;
