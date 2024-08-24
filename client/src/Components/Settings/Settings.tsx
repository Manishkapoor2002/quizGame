import { CircularProgress, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { CurrentSetting } from "../../global/types";

const Settings = () => {
    const [currentSetting, setCurrentSetting] = useState<CurrentSetting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                <CircularProgress size={24} />
            </div>
        );
    }

    return (
        <Container maxWidth="xl" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <Typography variant="h4">
                    Working
                </Typography>
            )}
        </Container>
    );
};

export default Settings;
