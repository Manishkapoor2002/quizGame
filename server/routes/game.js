import express, { text } from "express";
import dotenv from "dotenv";
import {
  User,
  UserRank,
  Quiz,
  QuizSummary,
  PremiumQuiz,
  PremuimQuizSummary,
} from "../db/indexDb.js";
import {
  getQuestions,
  getPremQuestion,
  checkValidateCategories,
} from "../helpfn.js";

import authenticationJWT from "../middleware/auth.js";
dotenv.config();

const gameRoute = express.Router();

// updating rankings of the user on the basis of totalScore
gameRoute.post("/updateRank", async (req, res) => {
  try {
    const data = await UserRank.find({}).sort({ totalScore: "desc" });

    if (!data.length) {
      return res.json({
        message: "Something went wrong",
      });
    }

    const bulkOps = data.map((user, index) => {
      const newRank = index + 1;
      const minRank =
        user.minRank === 0 ? newRank : Math.min(user.minRank, newRank);

      return {
        updateOne: {
          filter: { _id: user._id },
          update: { currentRank: newRank, minRank: minRank },
        },
      };
    });

    await UserRank.bulkWrite(bulkOps);

    res.json({
      message: "Updated",
      bulkOps,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// start normal quiz
gameRoute.post("/startNormalQuiz", authenticationJWT, async (req, res) => {
  const username = req.user.username;
  const { difficultyLevel, category, practiceGame } = req.body;

  if (!difficultyLevel || !category) {
    return res.json({
      message: "difficultyLevel,category,practiceGame mandatory fields",
    });
  }

  if (!checkValidateCategories(category)) {
    return res.json({
      message: "Custom Category only allowed in Premium",
    });
  }

  try {
    const [user, questionsObj] = await Promise.all([
      User.findOne({ username }),
      getQuestions(category, difficultyLevel),
    ]);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (!questionsObj) {
      return res.json({ message: "Failed to generate questions" });
    }

    const currTime = new Date();
    let expireGameTime = currTime.getTime() + 30 * 60 * 1000;

    const summary = await QuizSummary.findOne({ userId: user._id });

    if (!summary) {
      return res.json({
        message: "User quiz summary doesn't exist",
      });
    }

    const newQuiz = new Quiz({
      userId: user._id,
      questions: questionsObj.AllQuestions,
      answers: questionsObj.CorrectSolutions,
      difficultyLevel,
      category,
      practiceGame,
      userSolution: [],
      expireGameTime,
      userRankRef: user.rankings,
    });

    await newQuiz.save();

    summary.numberOfQuiz[difficultyLevel] =
      (summary.numberOfQuiz[difficultyLevel] || 0) + 1;
    summary.topics.set(category, (summary.topics.get(category) || 0) + 1);

    await summary.save();

    return res.json({
      message: "Questions sent successfully",
      questionsObj,
      quizId: newQuiz._id,
      expireGameTime,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});
// start premuim quiz:

gameRoute.post("/startPremiumQuiz", authenticationJWT, async (req, res) => {
  const { difficultyLevel, category } = req.body;

  if (!difficultyLevel || !category) {
    return res.json({
      message: "difficultyLevel,category are mandatory fields",
    });
  }

  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.json({ message: "User not found" });
    }
    if (!user.premiumUser) {
      return res.json({
        message: "Not a premium user",
      });
    }
    const questionsObj = await getPremQuestion(category, difficultyLevel);
    if (!questionsObj) {
      return res.json({ message: "Failed to generate questions" });
    }

    if (!questionsObj) {
      return res.json({
        message: "",
      });
    }
    const summary = await PremuimQuizSummary.findOne({ userId: user._id });

    if (!summary) {
      return res.json({
        message: "User quiz summary doesn't exist",
      });
    }

    const currTime = new Date();
    let expireGameTime = currTime.getTime() + 30 * 60 * 1000;

    const newPremQuiz = new PremiumQuiz({
      userId: user._id,
      questions: questionsObj.AllQuestions,
      answers: questionsObj.CorrectSolutions,
      answerDescription: questionsObj.detailedExplaination,
      mark: [],
      difficultyLevel,
      category,
      expireGameTime,
    });
    await newPremQuiz.save();

    summary.numberOfQuiz[difficultyLevel] =
      (summary.numberOfQuiz[difficultyLevel] || 0) + 1;
    summary.topics.set(category, (summary.topics.get(category) || 0) + 1);

    await summary.save();

    return res.json({
      message: "Questions sent successfully",
      questionsObj,
      quizId: newPremQuiz._id,
      expireGameTime,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      errorType: err.message,
    });
  }
});

// adding score in the quiz:
gameRoute.post("/addScore/:quizId", authenticationJWT, async (req, res) => {
  const { quizId } = req.params;
  const username = req.user.username;
  const { userAnswer } = req.body;
  const currTime = new Date().getTime();

  if (!quizId || !userAnswer) {
    return res.json({
      message: "quizId and userAnswer are required!",
    });
  }

  try {
    const [quiz, user] = await Promise.all([
      Quiz.findById(quizId),
      User.findOne({ username }),
    ]);

    if (!user) {
      return res.json({
        message: "User not found",
      });
    }

    if (!quiz) {
      return res.json({
        message: "Quiz not found!",
      });
    }
    if (quiz.userId != user._id) {
      return res.json({
        message: "Not Authenticated",
      });
    }
    if (quiz.expireGameTime <= currTime) {
      return res.json({
        message: "Quiz time over",
      });
    }

    const difficultyMarks = {
      Easy: 1,
      Medium: 3,
      Hard: 5,
    };

    const perQuesMark = difficultyMarks[quiz.difficultyLevel] || 0;

    if (perQuesMark === 0) {
      return res.json({
        message: "Invalid quiz difficulty level",
      });
    }

    const index = quiz.userSolution.length;

    if (index === 10) {
      return res.json({
        message: "There is only 10 questions in Quiz",
      });
    }
    const isCorrectAnswer = quiz.answers[index] === userAnswer;
    const score = isCorrectAnswer ? perQuesMark : (-1 * perQuesMark) / 4;
    quiz.mark.push(score);
    quiz.userSolution.push(userAnswer);
    await quiz.save();

    if (!quiz.practiceGame) {
      // only for non practice matches:
      const rank = await UserRank.findById(quiz.userRankRef);

      if (!rank) {
        return res.json({
          message: "Rank field is required in quiz",
        });
      }
      rank.totalScore += score;
      await rank.save();
    }

    res.json({
      message: "Answer submitted successfully",
    });
  } catch (err) {
    res.json({
      message: "Internal server error",
      error: err.message,
    });
  }
});
// adding score in the premium quiz:
gameRoute.post(
  "/addScorePremQuiz/:quizId",
  authenticationJWT,
  async (req, res) => {
    const { quizId } = req.params;
    const { userAnswer } = req.body;
    const { username } = req.user;
    const currTime = new Date().getTime();

    if (!quizId || !userAnswer) {
      return res.json({
        message: "quizId and userAnswer are required!",
      });
    }

    console.log(quizId);
    try {
      const [quiz, user] = await Promise.all([
        PremiumQuiz.findById(quizId),
        User.findOne({ username }),
      ]);

      console.log(user);
      if (!user) {
        return res.json({
          message: "User not found",
        });
      }

      if (!quiz) {
        return res.json({
          message: "Quiz not found",
        });
      }

      if (quiz.userId != user._id) {
        return res.json({
          message: "Not Authenticated",
        });
      }
      if (quiz.expireGameTime <= currTime) {
        return res.json({
          message: "Quiz time over",
        });
      }

      const difficultyMarks = {
        Easy: 1,
        Medium: 3,
        Hard: 5,
      };

      const perQuesMark = difficultyMarks[quiz.difficultyLevel] || 0;

      if (perQuesMark === 0) {
        return res.json({
          message: "Invalid quiz difficulty level",
        });
      }

      const index = quiz.userSolution.length;

      if (index === 10) {
        return res.json({
          message: "There is only 10 questions in Quiz",
        });
      }
      const isCorrectAnswer = quiz.answers[index] === userAnswer;
      const score = isCorrectAnswer ? perQuesMark : (-1 * perQuesMark) / 4;
      quiz.mark.push(score);
      quiz.userSolution.push(userAnswer);
      await quiz.save();

      res.json({
        message: "Answer submitted successfully",
      });
    } catch (err) {
      res.json({
        message: "Something went wrong",
        errorType: err.message,
      });
    }
  }
);
// get previous premium quizes of an user acc. to pageNumber to reduce server and client load:
gameRoute.get(
  "/getAllPremiumQuizzes/:username/:pageNumber",
  async (req, res) => {
    const { username, pageNumber } = req.params;

    const page = parseInt(pageNumber);
    if (isNaN(page) || page <= 0) {
      return res.json({
        message: "Page number must be a positive integer",
      });
    }

    if (!username) {
      return res.json({
        message: "Username is a required field",
      });
    }

    const pageSize = 10;
    const start = (page - 1) * pageSize;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.json({
          message: "User not found",
        });
      }

      const allQuizzes = await PremiumQuiz.find({ userId: user._id })
        .sort({ expireGameTime: "desc" })
        .skip(start)
        .limit(pageSize);

      return res.json({
        message: "Quizzes fetched successfully",
        allQuizzes,
      });
    } catch (err) {
      res.json({
        message: "Something went wrong",
        error: err.message,
      });
    }
  }
);

// get previous quizes of an user acc. to pageNumber to reduce server and client load:
gameRoute.get("/getAllQuizzes/:username/:pageNumber", async (req, res) => {
  const { username, pageNumber } = req.params;

  const page = parseInt(pageNumber);
  if (isNaN(page) || page <= 0) {
    return res.json({
      message: "Page number must be a positive integer",
    });
  }

  if (!username) {
    return res.json({
      message: "Username is a required field",
    });
  }

  const pageSize = 10;
  const start = (page - 1) * pageSize;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "User not found",
      });
    }

    const allQuizzes = await Quiz.find({ userId: user._id })
      .sort({ expireGameTime: "desc" })
      .skip(start)
      .limit(pageSize);

    return res.json({
      message: "Quizzes fetched successfully",
      allQuizzes,
    });
  } catch (err) {
    res.json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});
export default gameRoute;
