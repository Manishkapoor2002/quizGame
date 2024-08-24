import { Container, Grid, Typography, Button, Card, CardContent, Avatar, Badge, Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/userAtom";
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import LeaderBoard from "./LeaderBoard";
import { useNavigate } from "react-router-dom";


const QuizPage = () => {
    const currentUserState = useRecoilValue(userState);
    const navigate = useNavigate()

    return (
        <>
            <Container maxWidth="xl" sx={{
                marginTop: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
            }}>
                <Card sx={{
                    width: '100%',
                    maxWidth: '600px',
                    borderRadius: '15px',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                }}>
                    <CardContent sx={{ padding: '40px', textAlign: 'center' }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={currentUserState?.isPremiumUser ? (
                                <StarIcon sx={{ color: '#ffd700' }} />
                            ) : null}
                        >
                            <Avatar
                                src={currentUserState?.profilePicture}
                                alt={currentUserState?.username}
                                sx={{
                                    width: '120px',
                                    height: '120px',
                                    margin: '0 auto',
                                    border: '3px solid #fff',
                                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
                                }}
                            />
                        </Badge>

                        <Typography variant="h4" sx={{
                            fontWeight: 'bold',
                            color: '#333',
                            marginTop: '20px',
                        }}>
                            {currentUserState ? `Welcome, ${currentUserState.username} !` : "Login First"}

                        </Typography>

                        <Typography variant="subtitle1" sx={{ color: '#666', marginBottom: '30px' }}>
                            {currentUserState?.isPremiumUser ? 'Thank you for being a premium member!,Ready to test your knowledge?' : 'Ready to test your knowledge?'}
                        </Typography>
                    </CardContent>
                </Card>
            </Container>

            <Container maxWidth="xl" sx={{
                justifyContent: 'center',
            }}>
                <Grid container spacing={3} sx={{ marginTop: '40px' }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{
                            textAlign: 'center',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                            },
                        }}>
                            <CardContent>
                                <QuizIcon sx={{ fontSize: '50px', color: '#3f51b5' }} />
                                <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                                    Start Quiz
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                    }}
                                    onClick={() => {
                                        navigate('/normalQuiz')
                                    }}
                                >
                                    Start Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card sx={{
                            textAlign: 'center',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                            },
                        }}>
                            <CardContent>
                                <SchoolIcon sx={{ fontSize: '50px', color: '#3f51b5' }} />
                                <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                                    Practice Quiz
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                    }}
                                    onClick={() => {
                                        navigate("/practiceQuiz")
                                    }}
                                >
                                    Practice Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card sx={{
                            textAlign: 'center',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                            },
                            position: 'relative',
                        }}>
                            <CardContent
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    backgroundColor: currentUserState?.isPremiumUser ? 'transparent' : 'rgba(0, 0, 0, 0.05)',
                                    height: '200px',
                                    overflow: 'hidden',
                                }}
                            >
                                {!currentUserState?.isPremiumUser && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backdropFilter: 'blur(2px)', // Apply blur to this background layer
                                            zIndex: 1, // Keep it behind the lock icon and other content
                                        }}
                                    />
                                )}

                                <SchoolIcon  sx={{ fontSize: '50px', color: '#3f51b5' }} />

                                <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold', zIndex: 2 }}>
                                    Premium Quiz
                                </Typography>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        zIndex: 2,
                                    }}
                                    onClick={() => {
                                        navigate("/premuimQuiz")
                                    }}
                                    disabled={!currentUserState?.isPremiumUser}
                                >
                                    {currentUserState?.isPremiumUser ? 'Practice Premium Quiz' : 'Unlock Premium'}
                                </Button>

                                {!currentUserState?.isPremiumUser && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 3,
                                        }}
                                    >
                                        <LockIcon
                                            sx={{
                                                fontSize: '48px',
                                                color: '#FFD700',
                                            }}
                                        />
                                    </Box>
                                )}
                            </CardContent>

                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    marginTop: '20px',
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '20px',
                        textAlign: 'center',
                    }}
                >
                    Leader Board
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <LeaderBoard />
                </Box>
            </Container>

        </>
    );
};

export default QuizPage;
