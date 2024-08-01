import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SecurityKey = process.env.SecurityKey;
export const authenticationJWT = (req, res, next) => {
  const authHeader = req.headers.authentication;
  try {
    if (!authHeader) {
      return res.json({
        message: "Authentication header not Found!",
      });

      const userToken = authHeader.split(" ");
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
    }
  } catch (err) {}
};
