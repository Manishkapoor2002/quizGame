import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuizStruct } from '../../global/types';
import { Box, Chip, Grid, Typography, Paper } from '@mui/material';

const containerStyle = {
  padding: '40px',
  maxWidth: '1000px',
  margin: '100px auto',
  backgroundColor: '#f9f9f9',
};

const sectionStyle = {
  marginBottom: '24px',
};

const questionBlockStyle = {
  borderBottom: '1px solid #ddd',
  paddingBottom: '20px',
  marginBottom: '20px',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
};

const optionItemStyle = (isCorrect: boolean, isUserAnswer: boolean) => ({
  padding: '10px 16px',
  margin: '6px 0',
  borderRadius: '6px',
  border: '1px solid #ddd',
  transition: 'all 0.3s ease',
  backgroundColor: isUserAnswer
    ? isCorrect
      ? '#d4edda' // Light green for correct answer
      : '#f8d7da' // Light red for wrong answer
    : '#f4f4f4', // Default background for options
  fontWeight: isUserAnswer ? 'bold' : 'normal',
  color: isUserAnswer ? (isCorrect ? 'green' : 'red') : 'inherit',
});

const ScoreBoard = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizStruct | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuizScore = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:3000/game/getQuizScore/${quizId}`, {
          headers: {
            authentication: localStorage.getItem('token') || '',
          },
        });

        if (response.data.message === 'Quiz find successfully') {
          setQuizDetail(response.data.quiz);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizScore();
  }, [quizId]);

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

  const calculateStatistics = () => {
    if (!quizDetail) return { totalQuestions: 0, correctAnswers: 0, totalMarks: 0 };

    const totalQuestions = quizDetail.questions.length;
    const correctAnswers = quizDetail.userSolution.filter((sol, index) => sol === quizDetail.answers[index]).length;
    const totalMarks = quizDetail.mark.reduce((acc, mark) => acc + mark, 0);
    

    return {
      totalQuestions,
      correctAnswers,
      totalMarks,
    };
  };
  const { totalQuestions, correctAnswers, totalMarks } = calculateStatistics();
  return (
    <Box sx={containerStyle}>
      {quizDetail ? (
        <>
          <Paper elevation={4} sx={{ p: 4, mb: 6, backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quiz Results
            </Typography>
            <Grid container justifyContent="space-between" alignItems="center" sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Category: {quizDetail.category}
              </Typography>
              <Chip label={quizDetail.difficultyLevel} color="secondary" sx={{ fontWeight: 'bold' }} />
            </Grid>
            <Typography variant="body1" sx={{ ...sectionStyle, fontWeight: 500 }}>
              <strong>Total Questions:</strong> {totalQuestions}
            </Typography>
            <Typography variant="body1" sx={{ ...sectionStyle, fontWeight: 500 }}>
              <strong>Correct Answers:</strong> {correctAnswers}
            </Typography>
            <Typography variant="body1" sx={{ ...sectionStyle, fontWeight: 500 }}>
              <strong>Total Marks:</strong> {totalMarks.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ ...sectionStyle, fontWeight: 500 }}>
              <strong>Practice Game:</strong> {quizDetail.practiceGame ? 'Yes' : 'No'}
            </Typography>
          </Paper>
          {quizDetail.questions.map((q, questionIndex) => (
            <Paper key={questionIndex} elevation={2} sx={questionBlockStyle}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {questionIndex + 1}. {q.question}
              </Typography>
              <ul className="options-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {q.options.map((option, optionIndex) => {
                  const isUserAnswer = quizDetail.userSolution[questionIndex] === option;
                  const isCorrect = quizDetail.answers[questionIndex] === option;
                  return (
                    <li key={optionIndex} style={optionItemStyle(isCorrect, isUserAnswer)}>
                      {option}
                    </li>
                  );
                })}
              </ul>
              <Typography color="textSecondary" sx={{ mt: 2, fontWeight: 500 }}>
                <strong>Your Answer:</strong> {quizDetail.userSolution[questionIndex] || "Not answered"}
              </Typography>
              <Typography color="secondary" sx={{ mt: 1, fontWeight: 500 }}>
                <strong>Correct Answer:</strong> {quizDetail.answers[questionIndex]}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <strong>Marks:</strong> {quizDetail.mark[questionIndex]}
              </Typography>
            </Paper>
          ))}
        </>
      ) : (
        <Typography variant="h6" align="center" color="error">
          No quiz details available
        </Typography>
      )}
    </Box>
  );
};

export default ScoreBoard;
