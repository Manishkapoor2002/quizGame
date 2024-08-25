import { CircularProgress, Container, Grid, Typography, IconButton } from "@mui/material";
import axios from "axios";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { useEffect, useState } from "react";
import { CurrentSetting } from "../../global/types";
import { useNavigate } from "react-router-dom";
import Basic from "./Basic";
import SocialHandles from "./SocialHandles";

const Settings = () => {
    const navigate = useNavigate();
    const [currentSetting, setCurrentSetting] = useState<CurrentSetting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const socialHandles = currentSetting?.personalDetails.socialHandles || {};


    useEffect(() => {
        setLoading(true);
        const getCurrentSetting = async () => {
            try {
                const result = await axios.get("http://localhost:3000/setting/currentSetting", {
                    headers: {
                        authentication: localStorage.getItem("token") || '',
                    }
                });
                if (result && result.data.message === "current settings") {
                    console.log(result.data.currentSetting);
                    setCurrentSetting(result.data.currentSetting);
                    setError(null);
                } else {
                    setError(result.data.message);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        getCurrentSetting();
    }, []);

    if (loading) {
        return (
            <div style={{
                height: "100vh",
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress size={32} />
            </div>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ marginTop: '100px' }}>
            {error ? (
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Container>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            padding: '24px',
                            background: 'linear-gradient(135deg, #434343 0%, #434343 100%, #434343 100%)',
                            borderRadius: '12px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Grid item xs={12} md={4} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <img
                                src={currentSetting?.profilePicture}
                                alt="Profile Picture"
                                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                                {currentSetting?.username}
                            </Typography>
                            <IconButton
                                sx={{ padding: 0, marginTop: '8px' }}
                                onClick={() => navigate(`/profile/${currentSetting?.username}`)}
                            >
                                <OpenInNewOutlinedIcon sx={{ color: "#90caf9" }} />
                                <Typography variant="body2" sx={{ marginLeft: '8px', color: "#90caf9" }}>
                                    View Profile
                                </Typography>
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Container>
                            <Basic
                                Username={currentSetting?.username || "NA"}
                                Gender={currentSetting?.personalDetails?.Gender || "Male"}
                                Location={currentSetting?.personalDetails?.location || "NA"}
                                Birthday={currentSetting?.personalDetails?.DOB || null}
                            />

                            <SocialHandles
                                github={socialHandles.github || "NA"}
                                instagram={socialHandles.instagram || "NA"}
                                linkedin={socialHandles.linkedin || "NA"}
                                facebook={socialHandles.facebook || "NA"}
                                x={socialHandles.x || "NA"}
                                userWebsite={socialHandles.userWebsite || "NA"}
                            />

                    </Container>
                </Container>

            )}
        </Container>
    );
};

export default Settings;
