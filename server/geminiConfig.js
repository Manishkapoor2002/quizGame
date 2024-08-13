import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
const Api_key = process.env.GeminiKey;
const genAI = new GoogleGenerativeAI(Api_key);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export default model;