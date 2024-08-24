import React, { useEffect, useState } from "react";
import axios from "axios";
import { PremiumQuizStruct } from "../../global/types";
import { Container, Button, Typography, Box, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Paper, Modal, Grid, Chip } from "@mui/material";

interface QuizDetailsProps {
    currentUserId: string;
}

const styles = {
    tableContainer: {
        marginTop: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9',
        },
        '&:hover': {
            backgroundColor: '#f1f1f1',
        },
        cursor: 'pointer',
    },
    tableCell: {
        fontWeight: '500',
        color: '#333',
    },
    paginationControls: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    button: {
        minWidth: '100px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '700px',
    bgcolor: 'background.paper',
    height: '80vh',
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    overflowY: 'auto'
};

const questionBlockStyle = {
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '16px',
    marginBottom: '16px',
};

const optionItemStyle = (isCorrect: boolean, isUserAnswer: boolean) => ({
    padding: '8px 16px',
    margin: '4px 0',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s ease',
    backgroundColor: isUserAnswer
        ? isCorrect
            ? '#d4edda' // Light green for correct answer
            : '#f8d7da' // Light red for wrong answer
        : '#f4f4f4', // Default background for options
    fontWeight: isUserAnswer ? 'bold' : 'normal',
    color: isUserAnswer ? (isCorrect ? 'green' : 'red') : 'inherit',
});

const PremiumQuiz: React.FC<QuizDetailsProps> = ({ currentUserId }) => {
    const [page, setPage] = useState<number>(1);
    const [allPremuimQuiizzes, setAllPremiumQuizzes] = useState<PremiumQuizStruct[]>([]);
    const [currQuiz, setCurrQuiz] = useState<PremiumQuizStruct | null>(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getQuizDetail = async () => {
            setLoading(true);
            try {
                const result = await axios.get(
                    `http://localhost:3000/game/getAllPremiumQuizzes/${currentUserId}/${page}`
                );
                if (result.data.message === "Quizzes fetched successfully") {
                    setAllPremiumQuizzes(result.data.allQuizzes);
                    if (result.data.allQuizzes.length < 10) setIsLastPage(true);
                    else setIsLastPage(false);
                } else if (result.data.message === "No more Quizzes") {
                    setIsLastPage(true);
                }
            } catch (err) {
                console.error("Something went wrong:", err);
            } finally {
                setLoading(false);
            }
        };

        getQuizDetail();
    }, [page, currentUserId]);

    const handleNextPage = () => {
        if (!isLastPage) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
            setIsLastPage(false);
        }
    };

    return (
        <Container>
            {loading ? (
                <Typography variant="h6" align="center">
                    Loading...
                </Typography>
            ) : (
                <div>
                    <TableContainer component={Paper} style={styles.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Difficulty Level</TableCell>
                                    <TableCell align="left">Category</TableCell>
                                    <TableCell align="center">Practice Game</TableCell>
                                    <TableCell align="right">Total Marks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allPremuimQuiizzes.map((quiz, quizIndex) => {
                                    let sum = quiz.mark.reduce((acc, mark) => acc + mark, 0);

                                    return (
                                        <TableRow key={quizIndex} sx={styles.tableRow} onClick={() => {
                                            setCurrQuiz(quiz);
                                            handleOpen();
                                        }}>
                                            <TableCell align="left">{quiz.difficultyLevel}</TableCell>
                                            <TableCell align="left">{quiz.category}</TableCell>
                                            <TableCell align="center">{quiz.practiceGame ? "Yes" : "No"}</TableCell>
                                            <TableCell align="right">{sum}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box style={styles.paginationControls} display="flex" justifyContent="center" marginTop={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            style={styles.button}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextPage}
                            disabled={isLastPage}
                            style={styles.button}
                        >
                            Next
                        </Button>
                    </Box>
                </div>
            )}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    {currQuiz ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="h5" gutterBottom>
                                    Category: {currQuiz.category}
                                </Typography>
                                <Chip label={currQuiz.difficultyLevel} color="primary" />
                            </Grid>
                            {currQuiz.questions.map((q, questionIndex) => (
                                <div key={questionIndex} style={questionBlockStyle}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {questionIndex + 1}. {q.question}
                                    </Typography>
                                    <ul className="options-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                        {q.options.map((option, optionIndex) => {
                                            const isUserAnswer = currQuiz.userSolution[questionIndex] === option;
                                            const isCorrect = currQuiz.answers[questionIndex] === option;
                                            return (
                                                <li key={optionIndex} style={optionItemStyle(isCorrect, isUserAnswer)}>
                                                    {option}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <Typography color="primary" sx={{ mt: 2 }}>
                                        <strong>Your Answer:</strong> {currQuiz.userSolution[questionIndex] || "Not answered"}
                                    </Typography>
                                    <Typography color="secondary" sx={{ mt: 1 }}>
                                        <strong>Correct Answer:</strong> {currQuiz.answers[questionIndex]}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        <strong>Answer Description:</strong> {currQuiz.answerDescription[questionIndex]}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        <strong>Marks:</strong> {currQuiz.mark[questionIndex]}
                                    </Typography>
                                </div>
                            ))}
                            <hr />
                            <Typography variant="body1">
                                <strong>Practice Game:</strong> {currQuiz.practiceGame ? 'Yes' : 'No'}
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    ) : (
                        <Typography variant="h6" align="center" color="error">
                            Something went wrong
                        </Typography>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default PremiumQuiz;
