import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Profile from "./Components/Profile/Profile";
import StartPracticeQuiz from "./Components/Quiz/StartPracticeQuiz";
import QuizPage from "./Components/Quiz/QuizPage";
import ScoreBoard from "./Components/Quiz/ScoreBoard";
import StartNormalQuiz from "./Components/Quiz/StartNormalQuiz";
import StartPremiumQuiz from "./Components/Quiz/StartPremiumQuiz";
import SignIn from "./Components/SignUp";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PremiumScoreBoard from "./Components/Quiz/PremiumScoreBoard ";
import Settings from "./Components/Settings/Settings";
import Premium from "./Components/Premium/Premium";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<QuizPage />} />
        <Route path="/" element={<QuizPage />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/startquiz" element={<QuizPage />} /> */}
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/normalQuiz" element={<StartNormalQuiz />} />
        <Route path="/premuimQuiz" element={<StartPremiumQuiz />} />
        <Route path="/scoreboard/:quizId" element={<ScoreBoard />} />
        <Route path="/premiumScoreboard/:quizId" element={<PremiumScoreBoard />} />
        <Route path="/practiceQuiz" element={<StartPracticeQuiz />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
    </BrowserRouter>
  )
}