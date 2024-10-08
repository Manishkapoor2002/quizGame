import { Container, Grid, Typography, Box, Card, CardContent, Avatar, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import SettingsIcon from '@mui/icons-material/Settings';
import { UserData } from "../../global/types";
import PremiumUserIcon from "../../images/PremiumUserIcon.png"
import { useNavigate } from "react-router-dom";

interface MyPersonlDetailProps {
    userDetails: UserData
}

const UserDetailsCard = styled(Card)({
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.3s',
    position: 'relative'
});

const StyledAvatar = styled(Avatar)({
    width: 120,
    height: 120,
    border: '3px solid #3795BD',
    marginBottom: '16px',
});

const StyledTypography = styled(Typography)({
    color: '#3795BD',
    fontWeight: 'bold',
    marginBottom: '8px',
});

const DetailItem = styled(Typography)({
    fontSize: '16px',
    color: '#555',
    marginBottom: '4px',
});

const RankingItem = styled(Typography)({
    fontSize: '18px',
    color: '#3795BD',
    fontWeight: 'bold',
    marginBottom: '4px',
});

const PersonDetails: React.FC<MyPersonlDetailProps> = ({ userDetails }) => {

    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    const HandleSocial = (url: string): void => {
        window.open(url, '*')
        return;
    }

    return (
        <Container maxWidth="xl" sx={{ marginTop: '100px' }}>
            <UserDetailsCard>
                <CardContent>
                    <Box sx={{ position: 'relative' }}>
                        {currentUserId && currentUserId === userDetails.userId && (
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px'
                                }}
                                aria-label="settings"
                                onClick={() => {
                                    navigate("/settings")
                                }}
                            >
                                <SettingsIcon />
                            </IconButton>
                        )}
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <StyledAvatar src={userDetails.profilePicture} alt="Profile Picture" />
                                    <StyledTypography variant="h5">
                                        {userDetails.username}
                                    </StyledTypography>
                                    {userDetails.isPremiumUser && (
                                        <img src={PremiumUserIcon} alt="premuim User" style={{
                                            width: "20px"
                                        }} />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box padding={2}>
                                    {userDetails.personalDetails?.location && (
                                        <DetailItem><strong>Location:</strong> {userDetails.personalDetails.location}</DetailItem>
                                    )}

                                    {userDetails.personalDetails?.DOB && (
                                        <DetailItem><strong>DOB:</strong> {userDetails.personalDetails.DOB.toString().substring(0, 10)}</DetailItem>
                                    )}

                                    {userDetails.personalDetails?.education && (userDetails.personalDetails.education.schoolName != "" || userDetails.personalDetails.education.course != "" || userDetails.personalDetails.education.startYear || userDetails.personalDetails.education.finishYear) && (
                                        <Box marginTop={2}>
                                            <DetailItem>
                                                <strong>School:</strong> {userDetails.personalDetails.education.schoolName || "N/A"}
                                            </DetailItem>
                                            <DetailItem>
                                                <strong>Course:</strong> {userDetails.personalDetails.education.course || "N/A"}
                                            </DetailItem>
                                            {userDetails.personalDetails.education.startYear && (
                                                <DetailItem>
                                                    <strong>Start Year:</strong> {userDetails.personalDetails.education.startYear.toString().substring(0, 10)}
                                                </DetailItem>
                                            )}
                                            {userDetails.personalDetails.education.finishYear && (
                                                <DetailItem>
                                                    <strong>Finish Year:</strong> {userDetails.personalDetails.education.finishYear.toString().substring(0, 10)}
                                                </DetailItem>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box padding={2}>
                                    {userDetails.personalDetails?.socialHandles && (userDetails.personalDetails?.socialHandles.facebook != "" || userDetails.personalDetails?.socialHandles.instagram != "" || userDetails.personalDetails?.socialHandles.linkedin != "" || userDetails.personalDetails?.socialHandles.x != "" || userDetails.personalDetails?.socialHandles.userWebsite != "" || userDetails.personalDetails?.socialHandles.github != "") && (
                                        <Box marginTop={2}>
                                            <DetailItem>
                                                <strong>Social Handles:</strong>
                                            </DetailItem>
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                {userDetails.personalDetails.socialHandles.facebook && (
                                                    <span onClick={() => HandleSocial(userDetails.personalDetails?.socialHandles?.facebook || "")}>
                                                        Facebook
                                                    </span>
                                                )}
                                                {userDetails.personalDetails.socialHandles.github && (
                                                      <span onClick={() => HandleSocial(userDetails.personalDetails?.socialHandles?.github || "")}>
                                                      Github
                                                  </span>
                                                )}
                                                {userDetails.personalDetails.socialHandles.instagram && (
                                                      <span onClick={() => HandleSocial(userDetails.personalDetails?.socialHandles?.instagram || "")}>
                                                        Instagram
                                                    </span>
                                                )}
                                                {userDetails.personalDetails.socialHandles.linkedin && (
                                                    <a href={userDetails.personalDetails.socialHandles.linkedin} target="_blank" rel="noopener">
                                                        LinkedIn
                                                    </a>
                                                )}
                                                {userDetails.personalDetails.socialHandles.x && (
                                                    <a href={userDetails.personalDetails.socialHandles.x} target="_blank" rel="noopener">
                                                        X (formerly Twitter)
                                                    </a>
                                                )}
                                                {userDetails.personalDetails.socialHandles.userWebsite && (
                                                    <a href={userDetails.personalDetails.socialHandles.userWebsite} target="_blank" rel="noopener">
                                                        Website
                                                    </a>
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box padding={2}>
                                    <RankingItem>Current Rank: {userDetails.rankings.currentRank}</RankingItem>
                                    <RankingItem>Total Score: {userDetails.rankings.totalScore}</RankingItem>
                                    <RankingItem>Highest Rank Achieved: {userDetails.rankings.minRank}</RankingItem>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </UserDetailsCard>
        </Container>
    );
};

export default PersonDetails;