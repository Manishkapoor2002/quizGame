import { CircularProgress, Container, Grid, Typography, IconButton, Button } from "@mui/material";
import axios from "axios";
import { styled } from '@mui/material/styles';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from "react";
import { CurrentSetting, userStateType } from "../../global/types";
import { useNavigate } from "react-router-dom";
import Basic from "./Basic";
import SocialHandles from "./SocialHandles";
import Education from "./Education.tsx";
import { useSetRecoilState } from "recoil";
import { userState } from "../../store/userAtom.ts";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Settings = () => {
    const navigate = useNavigate();
    const currentUserAtom = useSetRecoilState<userStateType | null>(userState);
    const [currentSetting, setCurrentSetting] = useState<CurrentSetting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const socialHandles = currentSetting?.personalDetails.socialHandles || {};
    const [image, setImage] = useState<File | null>(null)


    const uploadToDb = async () => {
        setImageLoading(true);
       const url : string | null =  await handlePostUpload();
        console.log(url)
        if(url === null && url === "") return ;

        try {
            const result = await axios.post("http://localhost:3000/user/updateDp", {
                "url": url,
                _id:currentSetting?._id
            }, {
                headers: {
                    'authentication': localStorage.getItem("token")
                }
            });

            if (result.data.message === "Successfully uploaded") {
            setImageLoading(false);

                setCurrentSetting((curr: CurrentSetting | null) => 
                  curr ? { 
                    ...curr, 
                    profilePicture: url? url : ""  
                  } : null
                );

                currentUserAtom((curr : userStateType | null)=>(
                    curr ? {
                    ...curr,
                    profilePicture:url?url:"",
                    }: null 
                  ));
              }
           
            setImageLoading(false);
        } catch (err) {
            setImageLoading(false);
            console.log(err);
        }
    }

    const handlePostUpload = async () : Promise<string | null> => {

        if (!image) {
            alert("Select photo")
            return null;
        }
        const formData = new FormData();
        formData.append("image", image);

        try {
            const result = await axios.post("http://localhost:3000/user/imageUrlGen", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(result);


            if (result.data.message === 'File uploaded successfully') {
                return result.data.imageUrl;
            } else {
                console.log("something went wrong!")
            return null;
            }
        } catch (err) {
            console.log(err)
            return null;
        }


    }


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
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }} onClick={() => {

                        }}>
                            <img
                                src={currentSetting?.profilePicture}
                                alt="Profile Picture"
                                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            

                            <Button
                                component="label"
                                variant="outlined"
                                size="small"
                                startIcon={<CloudUploadIcon />}
                                style={{ marginBottom: '20px' }}
                            >
                                Change DP
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setImage(e.target.files[0]);
                                        }
                                    }}
                                />
                            </Button>

                            {image && (
                                <Button
                                component="label"
                                variant="outlined"
                                size="small"
                                style={{ marginBottom: '20px' }}
                                disabled={imageLoading}
                                onClick={uploadToDb}
                            >
                                {imageLoading ? "Uploading Pic" : "Update DP"}
                            </Button>
                            )
                            }

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

                        <Education
                            schoolName={currentSetting?.personalDetails.education?.schoolName ? currentSetting?.personalDetails.education?.schoolName : "NA"}
                            course={currentSetting?.personalDetails.education?.course ? currentSetting?.personalDetails.education?.course : "NA"}
                            startYear={currentSetting?.personalDetails.education?.startYear ? currentSetting?.personalDetails.education?.startYear : null}
                            finishYear={currentSetting?.personalDetails.education?.finishYear ? currentSetting?.personalDetails.education?.finishYear : null}
                        />

                    </Container>
                </Container>

            )
            }
        </Container >
    );
};

export default Settings;
