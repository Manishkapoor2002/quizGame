import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Link,
    Grid,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import Loginbackground from "../images/Loginbackground.jpeg";
import axios from 'axios';
type FormData = {
    email: string;
    password: string;
};

const Login = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (formData.email == "" || formData.password == "") {
            setIsSubmitting(false)
            alert("Username and password are required fields")
            return;
        }
        try {
            const result = await axios.post("http://localhost:3000/user/login", {
                email: formData.email,
                password: formData.password
            });
            if (result && result.data.message === "Successfully loged in") {
                setFormData({
                    email: "",
                    password: ""
                })
                localStorage.setItem("token", `Bearer ${result.data.token}`);
                alert("successfully loged in");
                return;
            }
            alert(result.data.message)
        } catch (err) {
            alert("An unexpected error occurred");
        } finally {
            setIsSubmitting(false)
            
        }

    };

    return (
        <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    padding: 4,
                    minHeight: '100vh'
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Log in
                </Typography>
                <Typography component="span" variant="subtitle1" sx={{ mb: 4, fontWeight: 'light' }}>
                    Ready for a brain battle? Let’s quiz! 🧠✨
                </Typography>
                <Box component="form" noValidate sx={{ width: '100%', maxWidth: 400 }} onSubmit={handleLogin} >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => {
                            setFormData((data) => ({
                                ...data,
                                email: e.target.value
                            }))
                        }}
                        value={formData.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            setFormData((data) => ({
                                ...data,
                                password: e.target.value
                            }))
                        }}
                        value={formData.password}

                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Log In'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Don't have account yet? Sign up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid
                item
                xs={0}
                md={6}
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    color: 'white',
                    height: '100vh',
                    objectFit: 'cover'
                }}
            >
                <img
                    src={Loginbackground}
                    alt="background"
                />
            </Grid>
        </Grid>
    );
}

export default Login
