import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AdBlockIcon from "@mui/icons-material/Block";
import CategoryIcon from "@mui/icons-material/Category";
import { userState } from "../../store/userAtom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useState } from "react";
import { userStateType } from "../../global/types";

const Premium = () => {
  const [currentUser,setCurrentUser] = useRecoilState<userStateType | null>(userState);
  const [paymentLoader, setPaymentLoader] = useState<boolean>(false);
  const [cancleLoader, setCancleLoader] = useState<boolean>(false);


  const canclePremium = async () => {
    if (!currentUser) {
      alert("Login first to purchase")
      return;
    }

    setCancleLoader(true);
    try{
      const result = await axios.post("http://localhost:3000/user/cancelPurchase", {}, {
        headers: {
          authentication: localStorage.getItem("token"),
        },
      });

      if(result && result.data.message === "Cancel Purchase Successfully"){
        setCancleLoader(false);
        alert("You Premium Plan Cancelled!")
        setCurrentUser((curr : userStateType | null)=>(
          curr ? {
          ...curr,
          isPremiumUser:false
          }: null 
        ));
        return;
      }
      setCancleLoader(false);
      alert(result.data.message)
    }catch (err) {
      setCancleLoader(false);

      if (err instanceof Error) {
        alert("Error :" + err.message as string)
      }
      alert("Login first to purchase")
      return;
    }

  }

  const makePayment = async (planType: "monthly" | "annually") => {
    if (!currentUser) {
      alert("Login first to purchase")
      return;
    }

    if (planType === "annually") {
      alert("Comming soon!!!")
      return;
    }

    setPaymentLoader(true);

    try {
      const result = await axios.post("http://localhost:3000/user/purchasePremuim", {}, {
        headers: {
          authentication: localStorage.getItem("token"),
        },
      });
      if (result && result.data.message === "Successfully purchased premuim") {
        console.log(result.data)
        alert("Thankyou for Purchasing Premium");
        setPaymentLoader(false);
        setCurrentUser((curr : userStateType | null)=>(
          curr ? {
          ...curr,
          isPremiumUser:true
          }: null 
        ));
        return;
      }
      setPaymentLoader(false);
      alert("Error is : " + result.data.message)
    } catch (err) {
      setPaymentLoader(false);

      if (err instanceof Error) {
        alert("Error :" + err.message as string)
      }
      alert("Login first to purchase")
      return;
    }

  }



  if (currentUser?.isPremiumUser) {
        return (
            <Container maxWidth="lg" sx={{ mt: "100px", textAlign: "center" }}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 4 }}
              >
                {`Hello, ${currentUser.username}!`}
              </Typography>
              <Typography
                component="h2"
                variant="h5"
                sx={{ mb: 4 }}
              >
                You are already a premium user. Would you like to cancel or upgrade your plan?
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 2 }}
                onClick={canclePremium}
                disabled={cancleLoader}
              >
                {cancleLoader ? "Cancelling Premium" :"Cancel Plan"}
              </Button>
            </Container>
          );
        };


  return (
    <Container maxWidth="lg" sx={{ mt: "100px", textAlign: "center" }}>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Go Premium
      </Typography>
      <Typography
        component="p"
        variant="h6"
        sx={{ color: "text.secondary", mb: 5 }}
      >
        Unlock all quizzes, track your progress, and enjoy an ad-free
        experience.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              p: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Monthly Plan
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ₹59.9 / month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Perfect for those who want flexibility in their learning
                journey.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => makePayment("monthly")}
                disabled={paymentLoader}
              >
                {paymentLoader ? "Processing Payment" : "Choose Monthly"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              p: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Annual Plan
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ₹599.99 / year
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Best value for committed learners. Save 20%!
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => makePayment("annually")}
              >
                Choose Annual
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Premium Features
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: "center" }}>
              <QuizIcon sx={{ fontSize: 50, mb: 2, color: "primary.main" }} />
              <Typography variant="h6" component="div">
                Exclusive Quizzes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access to premium, high-quality quizzes.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: "center" }}>
              <TrackChangesIcon
                sx={{ fontSize: 50, mb: 2, color: "secondary.main" }}
              />
              <Typography variant="h6" component="div">
                Progress Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor your quiz performance over time.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: "center" }}>
              <AdBlockIcon sx={{ fontSize: 50, mb: 2, color: "error.main" }} />
              <Typography variant="h6" component="div">
                Ad-Free Experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enjoy an uninterrupted learning experience.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3} mb="50px">
            <Box sx={{ textAlign: "center" }}>
              <CategoryIcon
                sx={{ fontSize: 50, mb: 2, color: "success.main" }}
              />
              <Typography variant="h6" component="div">
                Custom Topics & Categories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and access personalized quiz topics and categories.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Premium;
