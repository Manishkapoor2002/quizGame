import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  // Basic:
  userName: String,
  email: String,
  phoneNumber: Number,
  profilePicture: String,

  // Game related:
  currentRank: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  minRank: { type: Number, default: 0 }, //Best rank till now

  //   All Quizes:
  allUserQuizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
});

const userPasswordSchema = new Schema({
  userId: String,
  password: String,
});

const quizSchema = new Schema({
  questions: [],
  answers: [],
  correctAnswers: [],
  wrongAnswers: [],
  notAttemptedQues: [],
  difficultyLevel: String,
  category: String,
  practiceGame: Boolean,
});

const User = mongoose.model("User", userSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const UserPassword = mongoose.model("Password", userPasswordSchema);

export { User, Quiz, UserPassword };
