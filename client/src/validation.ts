import axios from "axios";

const checkEmail = (mail: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(mail)) {
        return false;
    }
    return true;
};

const checkPassword = (password: string): boolean => {
    const minLength = 8;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= minLength;

    return (
        isLongEnough &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialCharacters
    );
};

const usernameValidation = async (username: string): Promise<boolean> => {
    if (!username || username.length < 5) {
        return false;
    }
    const result = await axios.get(
        `http://localhost:3000/isAvailable/username/${username}`
    );
    if (result && result.data.message === "username is available to use") {
        return true;
    }
    return false;
};

const emailValidation = async (email: string): Promise<boolean> => {
    if (!email || !checkEmail(email)) {
        return false;
    }

    const result = await axios.get(
        `http://localhost:3000/isAvailable/email/${email}`
    );

    if (result && result.data.message === "email is available to use") {
        return true;
    }
    return false;
};

const passwordValidation = async (password: string): Promise<boolean> => {
    if (!password || password.length < 6 || !checkPassword(password))
        return false;

    return true;
};

const confirmPasswords = async (
    pass1: string,
    pass2: string
): Promise<boolean> => {
    console.log(pass1, pass2);
    if (pass1 === pass2) return true;

    return false;
};
export {
    usernameValidation,
    emailValidation,
    passwordValidation,
    confirmPasswords,
};
