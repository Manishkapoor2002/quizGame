import {
    CircularProgress,
    Container,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import { useState, useCallback } from "react";
import axios from "axios";
import QuizQuestions from "./QuizQuestions";
import QuizForm from "./QuizForm";

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

const StartPracticeQuiz = () => {
    const [startedQuiz, setStartedQuiz] = useState(false);
    const [quizDetail, setQuizDetail] = useState<QuizInit>({
        category: "Science and Technology",
        difficultyLevel: "Easy",
    });
    const [quiz, setQuiz] = useState<QuizQuestionsInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleSelectChange = useCallback(
        (field: keyof QuizInit) => (e: SelectChangeEvent<string>) => {
            setQuizDetail((prev) => ({
                ...prev,
                [field]: e.target.value as QuizInit[typeof field],
            }));
        },
        []
    );

    const handleStartQuiz = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await axios.post(
                "http://localhost:3000/game/StartPracticeQuiz",
                {
                    difficultyLevel: quizDetail.difficultyLevel,
                    category: quizDetail.category,
                    practiceGame: true,
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
            console.log(result.data)
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
        }}> <Typography variant="h4">{error}</Typography> </div>;
    }

    if (!startedQuiz) {
        return (
            <QuizForm
                quizDetail={quizDetail}
                onCategoryChange={handleSelectChange("category")}
                onDifficultyChange={handleSelectChange("difficultyLevel")}
                onStartQuiz={handleStartQuiz}
                isPractice={true}
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
                <QuizQuestions quizId={quiz.quizId} questions={quiz.questions} isPremium={false} />
            </Container>

        </>
    ) : (
        <Typography variant="h4">Something went wrong</Typography>
    );
};

export default StartPracticeQuiz;
