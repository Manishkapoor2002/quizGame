import model from "./geminiConfig.js";
import { UserRank } from "./db/indexDb.js";

export const getQuestions = async (category, diffLevel) => {
  try {
    const prompt = `Generate 10 unique and interesting ${diffLevel}-level multiple-choice questions on the topic ${category}. Each question should have 4 distinct options. Ensure that the questions are diverse and engaging. Provide the output in the following JSON format (only provide me the JSON, nothing else):
    {
      "AllQuestions": [
        {
          "question": "Question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
        },
        ...
      ],
      "CorrectSolutions": ["Correct option for question 1", "Correct option for question 2", ..., "Correct option for question 10"]
    }`;

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("No response from the model");
    }

    const text = await result.response.text();
    let data = JSON.parse(text);

    // Remove duplicate questions
    const seenQuestions = new Set();
    data.AllQuestions = data.AllQuestions.filter((question) => {
      if (seenQuestions.has(question.question)) {
        return false;
      }
      seenQuestions.add(question.question);
      return true;
    });

    // Ensure exactly 10 unique questions
    while (data.AllQuestions.length < 10) {
      const additionalQuestions = await model.generateContent(prompt);
      const additionalText = await additionalQuestions.response.text();
      const additionalData = JSON.parse(additionalText);

      additionalData.AllQuestions.forEach((question) => {
        if (data.AllQuestions.length >= 10) return;
        if (!seenQuestions.has(question.question)) {
          data.AllQuestions.push(question);
          seenQuestions.add(question.question);
        }
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    throw error;
  }
};

export const getPremQuestion = async (category, diffLevel) => {
  try {
    const prompt = `
      Generate a JSON object containing 10 unique and interesting multiple-choice questions on the topic of "${category}" at the "${diffLevel}" difficulty level. Each question should have 4 distinct options. Ensure that the questions are diverse and engaging. Provide the output in a clean JSON format as follows:
      {
        "AllQuestions": [
          {
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
          },
          ...
        ],
        "CorrectSolutions": ["Correct option for question 1", "Correct option for question 2", ..., "Correct option for question 10"],
        "detailedExplanation": [
          "Explanation for question 1",
          "Explanation for question 2",
          ...,
          "Explanation for question 10"
        ]
      }`;

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("No response from the model");
    }

    const text = await result.response.text();

    // Extract and parse the JSON object
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

    const jsonData = JSON.parse(jsonString);

    // Validate the structure of the returned JSON
    if (
      !jsonData.AllQuestions ||
      !Array.isArray(jsonData.AllQuestions) ||
      !jsonData.CorrectSolutions ||
      !Array.isArray(jsonData.CorrectSolutions) ||
      !jsonData.detailedExplanation ||
      !Array.isArray(jsonData.detailedExplanation)
    ) {
      throw new Error("Invalid JSON structure");
    }

    // Remove duplicate questions
    const seenQuestions = new Set();
    jsonData.AllQuestions = jsonData.AllQuestions.filter((question) => {
      if (seenQuestions.has(question.question)) {
        return false;
      }
      seenQuestions.add(question.question);
      return true;
    });

    // Ensure exactly 10 unique questions
    while (jsonData.AllQuestions.length < 10) {
      const additionalQuestions = await model.generateContent(prompt);
      const additionalText = await additionalQuestions.response.text();
      const additionalData = JSON.parse(additionalText);

      additionalData.AllQuestions.forEach((question) => {
        if (jsonData.AllQuestions.length >= 10) return;
        if (!seenQuestions.has(question.question)) {
          jsonData.AllQuestions.push(question);
          seenQuestions.add(question.question);
        }
      });
    }

    return jsonData;
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    throw error;
  }
};

export const checkValidateCategories = (category) => {
  const categories = new Set([
    "Science and Technology",
    "History and Geography",
    "Entertainment and Pop Culture",
    "Sports",
    "Literature and Language",
    "Current Events and General Knowledge",
  ]);

  return categories.has(category);
};

  const callUpdatedRank = () => {
    setInterval(async () => {
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
      } catch (error) {
        console.log("something went wrong!", "errortype : ", error.message);
      }
    },600000);
  };

export default callUpdatedRank;
