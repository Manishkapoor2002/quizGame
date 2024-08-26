import {Box, Button, Container, TextField, Typography} from "@mui/material";
import axios from "axios";
import {useState} from "react";

const colors = {
    primary: "#1E88E5",
    secondary: "#FFC107",
    background: "#F5F5F5",
    textPrimary: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0"
};

interface MySocialHandleInterface {
    facebook: string;
    instagram: string;
    linkedin: string;
    github: string;
    x: string;
    userWebsite: string;
}

type EditMode = {
    [key in keyof MySocialHandleInterface]: boolean;
};

const SocialHandles: React.FC<MySocialHandleInterface> = ({
                                                              facebook,
                                                              instagram,
                                                              linkedin,
                                                              github,
                                                              x,
                                                              userWebsite,
                                                          }) => {
    const [currentSetting, setCurrentSetting] = useState<MySocialHandleInterface>({
        facebook,
        instagram,
        linkedin,
        github,
        x,
        userWebsite,
    });

    const [editMode, setEditMode] = useState<EditMode>({
        facebook: false,
        instagram: false,
        linkedin: false,
        github: false,
        x: false,
        userWebsite: false,
    });

    const handleEditMode = (field: keyof MySocialHandleInterface) => {
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSave = async (field: keyof MySocialHandleInterface) => {
        const updatedValue = currentSetting[field]
        try {
            const result = await axios.post(`http://localhost:3000/setting/socialHandle`,
                {
                    key: [field].toString(),
                    value: updatedValue
                },
                {
                    headers: {authentication: localStorage.getItem('token') || ''},
                }
            );
            alert(result.data.message)

        } catch (err) {
            if (err instanceof Error) {
                alert(err.message as string)
                console.log(err);
            }
        } finally {
            setEditMode((prev) => ({
                ...prev,
                [field]: false
            }))
        }
    };

    const handleCancel = (field: keyof MySocialHandleInterface) => {
        setEditMode((prev) => ({
            ...prev,
            [field]: false,
        }));
        setCurrentSetting((prev) => ({
            ...prev,
            [field]: {
                facebook,
                instagram,
                linkedin,
                github,
                x,
                userWebsite,
            }[field],
        }));
    };

    const fields = Object.keys(currentSetting) as (keyof MySocialHandleInterface)[];

    return (
        <Container
            maxWidth="lg"
            sx={{
                marginTop: "100px",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                backgroundColor: colors.background,
                padding: "40px",
                border: `1px solid ${colors.border}`,
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: "20px",
                    textAlign: "left",
                }}
            >
                Social Handles
            </Typography>

            {fields.map((field) => (
                <Box key={field} mb={4}>
                    <Typography variant="h6" color={colors.secondary} sx={{marginBottom: "12px"}}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                    {editMode[field] ? (
                        <Box>
                            <TextField
                                id={`outlined-basic-${field}`}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                variant="outlined"
                                value={currentSetting[field]}
                                onChange={(e) => setCurrentSetting({
                                    ...currentSetting,
                                    [field]: e.target.value,
                                })}
                                sx={{
                                    width: "100%",
                                    marginBottom: "12px",
                                    backgroundColor: "#fff",
                                    borderRadius: "12px",
                                    "& .MuiOutlinedInput-root": {
                                        borderColor: colors.border,
                                    },
                                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: colors.primary,
                                    },
                                }}
                            />
                            <Box sx={{display: "flex", gap: "12px"}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: "600",
                                        borderRadius: "8px",
                                        backgroundColor: colors.primary,
                                        "&:hover": {
                                            backgroundColor: `${colors.primary}BF`, // Slightly transparent on hover
                                        },
                                    }}
                                    onClick={() => handleSave(field)}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: "600",
                                        borderRadius: "8px",
                                        borderColor: colors.secondary,
                                        color: colors.secondary,
                                        "&:hover": {
                                            borderColor: `${colors.secondary}BF`,
                                            color: `${colors.secondary}BF`,
                                        },
                                    }}
                                    onClick={() => handleCancel(field)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                            <Typography variant="body1" sx={{color: colors.textSecondary, fontWeight: "500"}}>
                                {currentSetting[field]}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "600",
                                    borderRadius: "8px",
                                    backgroundColor: colors.primary,
                                    "&:hover": {
                                        backgroundColor: `${colors.primary}BF`,
                                    },
                                }}
                                onClick={() => handleEditMode(field)}
                            >
                                Edit
                            </Button>
                        </Box>
                    )}
                </Box>
            ))}
        </Container>
    );
};

export default SocialHandles;
