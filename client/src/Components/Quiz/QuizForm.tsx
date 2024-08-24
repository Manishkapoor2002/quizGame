import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";


interface QuizInit {
    category: string;
    difficultyLevel: string;
}

const QuizForm: React.FC<{
    quizDetail: QuizInit;
    onCategoryChange: (e: SelectChangeEvent<string>) => void;
    onDifficultyChange: (e: SelectChangeEvent<string>) => void;
    onStartQuiz: () => void;
    isPractice: boolean
}> = ({ quizDetail, onCategoryChange, onDifficultyChange, onStartQuiz, isPractice }) => (
    <Container
        maxWidth="xl"
        sx={{
            marginTop: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            height:'80vh'
        }}
    >
        <Card
            sx={{
                width: "80%",
                borderRadius: "15px",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                pt:'25px'
            }}
        >
            <CardContent sx={{ padding: "40px", textAlign: "center" }}>
                <Typography variant="h4" sx={{ marginBottom: "30px" }}>
                    {
                        isPractice ? "Practice your skills, It doesn't affect your score" : "Ready to Start the Challenge?"
                    }

                </Typography>

                <Box sx={{ marginBottom: "20px" }}>
                    <InputLabel id="category-select-label" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Select Category
                    </InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={quizDetail.category}
                        onChange={onCategoryChange}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: "20px" }}
                    >
                        <MenuItem value="Science and Technology">Science and Technology</MenuItem>
                        <MenuItem value="History and Geography">History and Geography</MenuItem>
                        <MenuItem value="Entertainment and Pop Culture">Entertainment and Pop Culture</MenuItem>
                        <MenuItem value="Sports">Sports</MenuItem>
                        <MenuItem value="Literature and Language">Literature and Language</MenuItem>
                        <MenuItem value="Current Events and General Knowledge">
                            Current Events and General Knowledge
                        </MenuItem>
                    </Select>

                    <InputLabel id="difficulty-select-label" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Select Difficulty Level
                    </InputLabel>
                    <Select
                        labelId="difficulty-select-label"
                        id="difficulty-select"
                        value={quizDetail.difficultyLevel}
                        onChange={onDifficultyChange}
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
export default QuizForm