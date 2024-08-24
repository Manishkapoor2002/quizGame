import { useEffect, useState } from "react";
import { UserData } from "../../global/types"
import { useParams } from "react-router-dom";
import axios from "axios";
import PersonDetails from "./PersonDetails";
import { CircularProgress, Container, Grid } from "@mui/material";
import QuizDetails from "./QuizDetails";
import QuizSummary from "./QuizSummary";
const Profile = () => {
    const [userDetails, setUserDetails] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { username } = useParams<{ username: string }>();

    useEffect(() => {
        const getUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await axios.get(`http://localhost:3000/user/profile/${username}`);
                if (result.data.message === "User Found successfully") {
                    setUserDetails(result.data.details);
                } else {
                    setError("User not found");
                }
            } catch (err) {
                if(err instanceof Error){
                    setError(`Error : ${err.message as string} `);
                }else{
                    setError("something went wrong")
                }
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            getUserDetails();
        }
    }, [username]);

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
        }}>{error}</div>;
    }

    if (!userDetails) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>No user details available.</div>;
    }


    return (
        <>
            <PersonDetails userDetails={userDetails} />
            <Container maxWidth="xl">
                <Grid container spacing={4} mt={4}>
                    <Grid item xs={12} md={4}>
                        <QuizSummary currentUserId={userDetails.userId} />
                    </Grid>
                    <Grid item xs={12} md={8} sx={{

                    }}>
                        <QuizDetails currentUserId={userDetails.userId} />
                    </Grid>
                </Grid>

            </Container>
        </>

    )
}
export default Profile
