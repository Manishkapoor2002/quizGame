import React, { useState } from "react";
import { Container, Typography, Box, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import NormalQuiz from "./NormalQuiz";
import PremiumQuiz from "./PremuimQuiz";

interface QuizDetailsProps {
    currentUserId: string;
}

const styles = {
    toggleButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
        marginBottom: '20px',
    },
    toggleButtonGroup: {
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    toggleButton: {
        minWidth: '150px',
        padding: '10px 20px',
        fontWeight: 'bold',
        color: '#007bff',
        '&.MuiSelected': {
            backgroundColor: '#007bff',
            color: '#fff',
            '&:hover': {
                backgroundColor: '#0056b3',
            },
        },
    },
    container: {
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
    },
};

const QuizDetails: React.FC<QuizDetailsProps> = ({ currentUserId }) => {
    const [showPremium, setShowPremium] = useState<boolean>(false);

    const toggleQuizType = (event: React.MouseEvent<HTMLElement>, newQuizType: boolean | null) => {
        if (newQuizType !== null) {
            setShowPremium(newQuizType);
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper style={styles.container}>
                <Typography variant="h4" sx={styles.title}>
                    {showPremium ? "Premium Quizzes" : "Normal Quizzes"}
                </Typography>
                <Box style={styles.toggleButtonContainer}>
                    <ToggleButtonGroup
                        value={showPremium}
                        exclusive
                        onChange={toggleQuizType}
                        style={styles.toggleButtonGroup}
                    >
                        <ToggleButton value={false} style={styles.toggleButton}>
                            Normal Quizzes
                        </ToggleButton>
                        <ToggleButton value={true} style={styles.toggleButton}>
                            Premium Quizzes
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box>
                    {showPremium ? (
                        <PremiumQuiz currentUserId={currentUserId} />
                    ) : (
                        <NormalQuiz currentUserId={currentUserId} />
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default QuizDetails;
