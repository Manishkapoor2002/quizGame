import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect } from "react";

interface QuizInit {
    category: string;
    difficultyLevel: string;
}

const PremiumQuizForm: React.FC<{
    quizDetail: QuizInit;
    setQuizDetail: React.Dispatch<React.SetStateAction<QuizInit>>;
    onStartQuiz: () => void;
}> = ({ quizDetail, setQuizDetail, onStartQuiz }) => {

    useEffect(() => {
        setQuizDetail({
            category: "Space",
            difficultyLevel: "Medium",
        });
    }, [setQuizDetail]);

console.log(quizDetail)
    return (
        <Container
            maxWidth="lg"
            sx={{
                marginTop: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            }}
        >
            <Card
                sx={{
                    width: "80%",
                    borderRadius: "15px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                    pt: "25px",
                }}
            >
                <CardContent sx={{ padding: "40px", textAlign: "center" }}>
                    <Typography variant="h4" sx={{ marginBottom: "30px" }}>
                        Practice your premium skills, It doesn't affect your score
                    </Typography>
                    <span>Get the detailed explanation of each answer</span>

                    <Box sx={{ marginBottom: "20px" }}>
                        <InputLabel
                            id="category-select-label"
                            sx={{ fontWeight: "bold", marginBottom: "10px" }}
                        >
                            Select Category
                        </InputLabel>
                        <TextField
                            id="category-input"
                            label="Category"
                            variant="outlined"
                            value={quizDetail.category}
                            onChange={(e) =>
                                setQuizDetail((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                }))
                            }
                            fullWidth
                        />

                        <InputLabel
                            id="difficulty-select-label"
                            sx={{ fontWeight: "bold", marginBottom: "10px" }}
                        >
                            Select Difficulty Level
                        </InputLabel>
                        <Select
                            labelId="difficulty-select-label"
                            id="difficulty-select"
                            value={quizDetail.difficultyLevel}
                            onChange={(e) => {
                                setQuizDetail((prev) => ({
                                    ...prev,
                                    difficultyLevel: e.target.value as string,
                                }));
                            }}
                            fullWidth
                            variant="outlined"
                        >
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </Box>

                    <Button
                        onClick={onStartQuiz}
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            backgroundColor: "#ff7043",
                            ":hover": {
                                backgroundColor: "#ff5722",
                            },
                            padding: "10px 20px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                        }}
                    >
                        Start Quiz
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default PremiumQuizForm;
