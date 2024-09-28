import mongoose, { Schema } from "mongoose";

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phoneNumber: { type: Number, required: true, unique: true, index: true },
  profilePicture: {
    type: String,
    default:
      "http://res.cloudinary.com/dzfvpd08i/image/upload/v1717259736/minMax-post-2024-6-1%2022:5:34.png",
  },
  premiumUser: { type: Boolean, required: true, default: false },
  subscriptionExpireTime: { type: Date, default: Date.now },
  personalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPersonalDetail",
  },
  rankings: { type: mongoose.Schema.Types.ObjectId, ref: "UserRank" },
});

// Password Schema (store hashed password)
const userPasswordSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: { type: String, required: true },
});

// Quiz Summary Schema
const quizSummarySchema = new Schema({
  userId: { type: String, require: true },
  numberOfQuiz: {
    Easy: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    Hard: { type: Number, default: 0 },
  },
  topics: {
    type: Map,
    of: Number,
    default: {},
  },
});

// User Personal Details Schema
const userPersonalDetailSchema = new Schema({
  socialHandles: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    x: { type: String, default: "" },
    userWebsite: { type: String, default: "" },
  },
  location: { type: String, default: "" },
  education: {
    schoolName: { type: String, default: "" },
    course: { type: String, default: "" },
    startYear: { type: Date, default: null },
    finishYear: { type: Date, default: null },
  },
  DOB: { type: Date, default: null },
  Gender :{type : String,default :null}
});

// User Ranking Schema
const userRankingSchema = new Schema({
  currentRank: { type: Number, default: 9999999 },
  totalScore: { type: Number, default: 0 },
  minRank: { type: Number, default: 0 }, // Best rank till now
});

// Quiz Schema
const quizSchema = new Schema({
  userId: { type: String, require: true },
  questions: [
    {
      question: String,
      options: [String],
    },
  ],
  answers: [{ type: String, required: true }],
  userSolution: [{ type: String, required: true }],
  mark: [{ type: Number, required: true }],
  difficultyLevel: { type: String, required: true },
  category: { type: String, required: true },
  practiceGame: { type: Boolean, default: true },
  expireGameTime: { type: Date, required: true },
  userRankRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRank",
    required: true,
  },
});

// Premium Quiz Schema
const premiumQuizSchema = new Schema({
  userId: { type: String, require: true },
  questions: [
    {
      question: String,
      options: [String],
    },
  ],
  answers: [{ type: String, required: true }],
  answerDescription: [{ type: String, required: true }],
  userSolution: [{ type: String, required: true }],
  mark: [{ type: Number, required: true }],
  difficultyLevel: { type: String, required: true },
  category: { type: String, required: true },
  expireGameTime: { type: Date, required: true },
});

// Quiz Summary Schema
const premiumQuizSummarySchema = new Schema({
  userId: { type: String, require: true },
  numberOfQuiz: {
    Easy: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    Hard: { type: Number, default: 0 },
  },
  topics: {
    type: Map,
    of: Number,
    default: {},
  },
});

// Models
const User = mongoose.model("User", userSchema);
const UserPassword = mongoose.model("UserPassword", userPasswordSchema);
const UserRank = mongoose.model("UserRank", userRankingSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const UserPersonalDetail = mongoose.model(
  "UserPersonalDetail",
  userPersonalDetailSchema
);
const PremiumQuiz = mongoose.model("PremiumQuiz", premiumQuizSchema);
const QuizSummary = mongoose.model("QuizSummary", quizSummarySchema);
const PremuimQuizSummary = mongoose.model(
  "PremuimQuizSummary",
  premiumQuizSummarySchema
);

export {
  User,
  Quiz,
  UserPassword,
  UserRank,
  UserPersonalDetail,
  PremiumQuiz,
  QuizSummary,
  PremuimQuizSummary,
};
