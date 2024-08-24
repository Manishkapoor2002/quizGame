import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuizStruct } from '../../global/types';
import { Box, Chip, Grid, Typography, Paper } from '@mui/material';

const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '150px auto',
};

const sectionStyle = {
  marginBottom: '20px',
};

const questionBlockStyle = {
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: '16px',
  marginBottom: '16px',
};

const optionItemStyle = {
  padding: '8px 16px',
  margin: '4px 0',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
};

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
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Quiz Results
            </Typography>
            <Grid container justifyContent="space-between" alignItems="center" sx={sectionStyle}>
              <Typography variant="h5">
                Category: {quizDetail.category}
              </Typography>
              <Chip label={quizDetail.difficultyLevel} color="primary" />
            </Grid>
            <Typography variant="body1" sx={sectionStyle}>
              <strong>Total Questions:</strong> {totalQuestions}
            </Typography>
            <Typography variant="body1" sx={sectionStyle}>
              <strong>Correct Answers:</strong> {correctAnswers}
            </Typography>
            <Typography variant="body1" sx={sectionStyle}>
              <strong>Total Marks:</strong> {totalMarks.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={sectionStyle}>
              <strong>Practice Game:</strong> {quizDetail.practiceGame ? 'Yes' : 'No'}
            </Typography>
          </Paper>
          {quizDetail.questions.map((q, questionIndex) => (
            <Paper key={questionIndex} elevation={1} sx={questionBlockStyle}>
              <Typography variant="h6">
                {questionIndex + 1}. {q.question}
              </Typography>
              <ul className="options-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {q.options.map((option, optionIndex) => (
                  <li key={optionIndex} style={optionItemStyle}>
                    {option}
                  </li>
                ))}
              </ul>
              <Typography color="primary">
                <strong>Your Answer:</strong> {quizDetail.userSolution[questionIndex] || "Not answered"}
              </Typography>
              <Typography color="secondary">
                <strong>Correct Answer:</strong> {quizDetail.answers[questionIndex]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
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
