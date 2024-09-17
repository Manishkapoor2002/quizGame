import { Dayjs } from "dayjs";

type SocialHandles = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?:string,
  x?: string;
  userWebsite?: string;
};

type Education = {
  schoolName: string;
  course: string;
  startYear: Dayjs | null;
  finishYear: Dayjs | null;
};

type PersonalDetails = {
  socialHandles?: SocialHandles;
  location?: string;
  education?: Education;
  DOB: Dayjs | null;
  Gender:"Male" | "Female"
};

type Rankings = {
  currentRank: number;
  totalScore: number;
  minRank: number;
};

type QuizCategory =
  | "Science and Technology"
  | "History and Geography"
  | "Entertainment and Pop Culture"
  | "Sports"
  | "Literature and Language"
  | "Current Events and General Knowledge";

type QuizDifficulty = "Easy" | "Medium" | "Hard";

type Question = {
  question: string;
  options: string[];
};

type QuizStruct = {
  userId: string;
  questions: Question[];
  answers: string[];
  userSolution: string[];
  mark: number[];
  difficultyLevel: QuizDifficulty;
  category: QuizCategory;
  practiceGame: boolean;
  expireGameTime: Date;
};

type PremiumQuizStruct = QuizStruct & {
  answerDescription: string[];
};

type QuizSummaryStruct = {
  userId: string;
  numberOfQuiz: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  topics: Map<string, number>;
};

type LeaderBoardUserDetail = {
  username: string;
  userId: string;
  profilepic: string;
  currentRank: number;
  totalScore: number;
};

type QuizInit = {
  category: QuizCategory;
  difficultyLevel: QuizDifficulty;
};

type NormalQuiz = {
  quizId: string;
  questions: {
    AllQuestions: string;
    CorrectSolutions: string[];
  }[];
};

type CurrentSetting = {
  username: string;
  _id: string;
  email: string;
  phoneNumber: number;
  profilePicture: string;
  premiumUser: boolean;
  personalDetails: PersonalDetails;
  subscriptionExpireTime: Date;
};

type userStateType = {
  userId: string;
  profilePicture: string;
  username: string;
  email:string,
  isPremiumUser: boolean;
};

type UserData = {
  username: string;
  userId: string;
  isPremiumUser: boolean;
  profilePicture: string;
  personalDetails?: PersonalDetails;
  rankings: Rankings;
};

export type {
  userStateType,
  UserData,
  QuizStruct,
  QuizSummaryStruct,
  PremiumQuizStruct,
  LeaderBoardUserDetail,
  QuizInit,
  NormalQuiz,
  CurrentSetting,
};
