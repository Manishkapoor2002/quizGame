import {
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import QuizQuestions from "./QuizQuestions";
import PremiumQuizForm from "./PremiumQuizForm";

interface QuizQuestion {
    question: string;
    options: string[];
}

interface QuizInit {
    category: string;
    difficultyLevel: string;
}

interface QuizQuestionsInterface {
    quizId: string;
    questions: QuizQuestion[];
}

const StartPremiumQuiz = () => {
    const [startedQuiz, setStartedQuiz] = useState(false);
    const [quizDetail, setQuizDetail] = useState<QuizInit>({
        category: "Space",
        difficultyLevel: "Medium",
    });
    const [quiz, setQuiz] = useState<QuizQuestionsInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");


    const handleStartQuiz = async () => {
        if (quizDetail.category == "") {
            alert("Invalid Category")
            return;
        }
        setLoading(true);
        setError("");
        try {
            const result = await axios.post(
                "http://localhost:3000/game/startPremiumQuiz",
                {
                    difficultyLevel: quizDetail.difficultyLevel,
                    category: quizDetail.category,
                    practiceGame: false,
                },
                {
                    headers: {
                        authentication: localStorage.getItem("token"),
                    },
                }
            );

            if (result.data.message === "Questions sent successfully") {
                setQuiz({
                    quizId: result.data.quizId,
                    questions: result.data.questionsObj.AllQuestions,
                });
                setStartedQuiz(true);
            } else {
                setError(result.data.message);
            }
        } catch (err) {
            setError((err as any).message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress color="inherit" />
            </div>
        )
    }

    if (error) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}> <Typography variant="h4">{error === "Authentication header not Found!" ? "Login to start the Quiz" : error}</Typography> </div>;
    }

    if (!startedQuiz) {
        return (
            <PremiumQuizForm
                quizDetail={quizDetail}
                setQuizDetail={setQuizDetail}
                onStartQuiz={handleStartQuiz}
            />
        );
    }

    return quiz ? (
        <>
            <Container maxWidth="xl" sx={{
                mt: "200px"
            }}>
                <Typography variant="h6" sx={{ textAlign: "center", marginBottom: "20px" }}>
                    All Questions are Mandatory
                </Typography>
                <QuizQuestions quizId={quiz.quizId} questions={quiz.questions} isPremium={true}/>
            </Container>

        </>
    ) : (
        <Typography variant="h4">{error}</Typography>
    );
};

export default StartPremiumQuiz;
