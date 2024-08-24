import { useEffect, useState } from "react";
import { QuizSummaryStruct } from "../../global/types";
import axios from "axios";
import { Container, Grid, Typography, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText } from "@mui/material";

interface QuizDetailsProps {
    currentUserId: string;
}

const QuizSummary: React.FC<QuizDetailsProps> = ({ currentUserId }) => {
    const [quizSummary, setQuizSummary] = useState<QuizSummaryStruct | null>(null);
    const [premQuizSummary, setPremiumQuizSummary] = useState<QuizSummaryStruct | null>(null);

    useEffect(() => {
        const getQuizSummary = async () => {
            try {
                const result = await axios.get(`http://localhost:3000/user/getQuizzesSummary/${currentUserId}`);
                if (result && result.data.message === "Quiz Summary Send Successfully") {
                    setQuizSummary(result.data.normalQuizSummary);
                    setPremiumQuizSummary(result.data.premiumQuizSummary);
                }
            } catch (err) {
                console.log(err);
            }
        };
        getQuizSummary();
    }, [currentUserId]);

    const renderDifficultyLevels = (numberOfQuiz: { Easy: number; Medium: number; Hard: number }) => (
        <Grid container spacing={2}>
            {Object.entries(numberOfQuiz).map(([difficulty, count]) => (
                <Grid item xs={4} key={difficulty}>
                    <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="h6" color="textPrimary">
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {count} quizzes
                        </Typography>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const renderTopicsList = (topics: Map<String, Number>) => (
        <List>
            {Object.entries(topics).map(([topic, count]) => (
                <ListItem key={topic}>
                    <ListItemText primary={`${topic}: x${count}`} />
                </ListItem>
            ))}
        </List>
    );

    const renderQuizSummary = (title: string, summary: QuizSummaryStruct | null) => (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
                title={title}
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ backgroundColor: 'primary.main', color: 'white' }}
            />
            <CardContent>
                {summary ? (
                    <>
                        <Typography variant="subtitle1" gutterBottom>
                            Difficulty Levels
                        </Typography>
                        {renderDifficultyLevels(summary.numberOfQuiz)}

                        {summary.topics && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" gutterBottom>
                                    Topics
                                </Typography>
                                {renderTopicsList(summary.topics)}
                            </>
                        )}
                    </>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No data available.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
    return (
        <Container maxWidth="md">

            {renderQuizSummary("Normal Quiz Summary", quizSummary)}

            {premQuizSummary && renderQuizSummary("Premium Quiz Summary", premQuizSummary)}
        </Container>
    );
};

export default QuizSummary;
