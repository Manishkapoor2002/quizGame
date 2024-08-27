import {
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface QuizQuestion {
    question: string;
    options: string[];
}
interface QuizQuestionsInterface {
    quizId: string;
    questions: QuizQuestion[];
    isPremium: boolean
}

const QuizQuestions: React.FC<QuizQuestionsInterface> = ({ quizId, questions, isPremium }) => {
    const navigate = useNavigate();
    const [index, setIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(45);

    const currentQuestion = useMemo(() => questions[index], [questions, index]);

    const resetTimer = useCallback(() => {
        setTimer(45);
    }, []);


    const handleSkip = useCallback(async () => {
        setLoading(true);
        try {
            await axios.post(`http://localhost:3000/game/${isPremium ? 'addScorePremQuiz' : 'addScore'}/${quizId}`, {
                userAnswer: 'not answered',
            }, {
                headers: { authentication: localStorage.getItem('token') || '' },
            });

            if (index === questions.length - 1) {
                navigate(`/${isPremium ? 'premiumScoreboard' : 'scoreBoard'}/${quizId}`);
            } else {
                setIndex(prevIndex => prevIndex + 1);
                resetTimer();
                setSelectedOption('');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
    }, [index, quizId, questions.length, navigate, resetTimer, isPremium]);

    const handleNoAnswer = useCallback(async () => {
        setLoading(true);
        try {
            await axios.post(`http://localhost:3000/game/${isPremium ? 'addScorePremQuiz' : 'addScore'}/${quizId}`, {
                userAnswer: selectedOption != "" ? selectedOption : 'not answered',
            }, {
                headers: { authentication: localStorage.getItem('token') || '' },
            });

            if (index === questions.length - 1) {
                navigate(`/${isPremium ? 'premiumScoreboard' : 'scoreBoard'}/${quizId}`);
            } else {
                setIndex(prevIndex => prevIndex + 1);
                resetTimer();
                setSelectedOption('');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
    }, [index, quizId, questions.length, navigate, resetTimer, isPremium]);

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        try {
            await axios.post(`http://localhost:3000/game/${isPremium ? 'addScorePremQuiz' : 'addScore'}/${quizId}`, {
                userAnswer: selectedOption,
            }, {
                headers: { authentication: localStorage.getItem('token') || '' },
            });

            if (index === questions.length - 1) {
                navigate(`/${isPremium ? 'premiumScoreboard' : 'scoreBoard'}/${quizId}`);
            } else {
                setIndex(prevIndex => prevIndex + 1);
                resetTimer();
                setSelectedOption('');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedOption, index, quizId, questions.length, navigate, resetTimer, isPremium]);

    useEffect(() => {
        resetTimer();
    }, [index, resetTimer]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            handleNoAnswer();
        }, 45000);

        return () => clearTimeout(timerId);
    }, [index, handleNoAnswer]);


    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [index]);

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
    };


    return (
        <Box sx={{ padding: 2, maxWidth: 600, margin: '40px auto' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {`${index + 1}. ${currentQuestion.question}`}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Time left: {timer} seconds
            </Typography>
            <RadioGroup
                aria-labelledby={`question-${index}`}
                name={`question-${index}`}
                value={selectedOption}
                onChange={handleOptionChange}
                sx={{ marginBottom: 2 }}
            >
                {currentQuestion.options.map((option, idx) => (
                    <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio />}
                        label={option}
                    />
                ))}
            </RadioGroup>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    onClick={handleSkip}
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', textTransform: 'none' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (index === questions.length - 1 ? 'Finish' : 'Skip')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading || !selectedOption}
                    sx={{ padding: '10px 20px', textTransform: 'none' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (index === questions.length - 1 ? 'Finish' : 'Next Question')}
                </Button>
              
            </Box>
        </Box>
    );
};

export default QuizQuestions