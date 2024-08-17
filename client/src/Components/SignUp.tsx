import React, { useState, useEffect } from 'react';
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
import debounce from 'lodash/debounce';
import SignUpbackgound from "../images/SignUpbackgound.jpeg";
import {
    usernameValidation,
    emailValidation,
    passwordValidation,
    confirmPasswords,
} from '../validation';

type FormData = {
    username: string;
    email: string;
    password: string;
};

type ValidateField = {
    username: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
};

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
    });
    const [validate, setValidate] = useState<ValidateField>({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const debounceEmail = debounce(async (email: string) => {
        const result = await emailValidation(email);
        setValidate((data) => ({
            ...data,
            email: result,
        }));
        setFormData((data) => ({
            ...data,
            email,
        }));
    }, 2000);

    const debounceUsername = debounce(async (username: string) => {
        const result = await usernameValidation(username);
        setValidate((data) => ({
            ...data,
            username: result,
        }));
        setFormData((data) => ({
            ...data,
            username,
        }));
    }, 2000);

    const debouncePassword = debounce(async (password: string) => {
        const result = await passwordValidation(password);
        setValidate((data) => ({
            ...data,
            password: result,
        }));
        setFormData((data) => ({
            ...data,
            password,
        }));
    }, 2000);

    const debounceConfirmPassword = debounce(async (pass: string) => {
        const result = await confirmPasswords(pass, formData.password);
        setValidate((data) => ({
            ...data,
            confirmPassword: result,
        }));
    }, 2000);

    useEffect(() => {
        return () => {
            debounceEmail.cancel();
            debounceUsername.cancel();
            debouncePassword.cancel();
            debounceConfirmPassword.cancel();
        };
    }, []);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { email, username, password } = formData;

        if (!email || !username || !password) {
            alert("All Fields are required!");
            setIsSubmitting(false);
            return;
        }

        const isEmailValid = validate.email;
        const isUsernameValid = validate.username;
        const isPasswordValid = validate.password;
        const isConfirmPasswordValid = validate.confirmPassword;

        if (!isEmailValid || !isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
            alert("Please correct the form errors before submitting.");
            setIsSubmitting(false);
            return;
        }

        setInterval(() => {
            setIsSubmitting(false);
        }, 3000)

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
                    Sign in
                </Typography>
                <Typography component="span" variant="subtitle1" sx={{ mb: 4, fontWeight: 'light' }}>
                    Every great journey starts with a single step
                </Typography>
                <Box component="form" noValidate sx={{ width: '100%', maxWidth: 400 }} onSubmit={handleSignUp}>
                    <TextField
                        error={!validate.username}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="User Name"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => debounceUsername(e.target.value)}
                        helperText={!validate.username ? 'username not available' : ''}
                    />
                    <TextField
                        error={!validate.email}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => debounceEmail(e.target.value)}
                        helperText={!validate.email ? 'Invalid email address' : ''}
                    />
                    <TextField
                        error={!validate.password}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => debouncePassword(e.target.value)}
                        helperText={!validate.password ? 'Invalid password' : ''}
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
                    />
                    <TextField
                        error={!validate.confirmPassword}
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        onChange={(e) => debounceConfirmPassword(e.target.value)}
                        helperText={!validate.confirmPassword ? 'Passwords do not match' : ''}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Sign In'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an Account? Log in
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
                    src={SignUpbackgound}
                    alt="background"
                />
            </Grid>
        </Grid>
    );
};

export default SignIn;
