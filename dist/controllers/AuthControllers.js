"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.sendOtp = exports.changePassword = exports.refreshUser = exports.userSignIn = exports.userSignUp = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Function to generate an access token
const generateAccessToken = (payload) => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
    }
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};
// Function to generate a refresh token
const generateRefreshToken = (payload) => {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined in the environment variables");
    }
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
// Controller to sign up a new user
const userSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        if (!req.body.email || !req.body.password || !req.body.name) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        // Check if user already exists
        const userExists = yield UserModel_1.default.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Create a new user from the request body
        const user = new UserModel_1.default(req.body);
        // Generate tokens
        const accessToken = generateAccessToken({ _id: user._id });
        const refreshToken = generateRefreshToken({ _id: user._id });
        // Save the user to the database
        yield user.save();
        // Return the user and tokens as a response
        res.status(201).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while creating a new user" });
    }
});
exports.userSignUp = userSignUp;
// Controller to sign in an existing user
const userSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        // Fetch the user with the provided email
        const user = yield UserModel_1.default.findOne({
            email: req.body.email,
        });
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if the provided password is correct
        const isMatch = yield user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }
        // Generate tokens
        const accessToken = generateAccessToken({ _id: user._id });
        const refreshToken = generateRefreshToken({ _id: user._id });
        // Return the user and tokens as a response
        res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while signing in" });
    }
});
exports.userSignIn = userSignIn;
// Controller to refresh tokens
const refreshUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("refreshUser");
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required" });
        }
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield UserModel_1.default.findById(payload._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const newAccessToken = generateAccessToken({ _id: user._id });
        const newRefreshToken = generateRefreshToken({ _id: user._id });
        res
            .status(200)
            .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while refreshing the tokens" });
    }
});
exports.refreshUser = refreshUser;
//controller to change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // validate request body
        if (!req.body.newPassword) {
            return res.status(400).json({ error: "New password is required" });
        }
        const { newPassword } = req.body;
        //get user id from token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        //fetch user from database
        const userDoc = yield UserModel_1.default.findById(user._id);
        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }
        //update password
        userDoc.password = newPassword;
        yield userDoc.save();
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while changing password" });
    }
});
exports.changePassword = changePassword;
//controller to get user email from request and send otp to email for password reset
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //validate request body
        if (!req.body.email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const { email } = req.body;
        //fetch user from database
        const userDoc = yield UserModel_1.default.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }
        //generate otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        //save otp to user document with expiry time of 5 minutes from now
        userDoc.otp = otp;
        userDoc.otpExpiry = Date.now() + 5 * 60 * 1000;
        yield userDoc.save();
        //send otp to user email
        // Send the OTP via email
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "manushadananjaya999@gmail.com",
                pass: "tums mfyz lncy tmhk",
            },
        });
        const mailOptions = {
            from: "manushadananjaya999@gmail.com",
            to: userDoc.email,
            subject: "Registration OTP",
            html: `
        <p>Hello,</p>
        <p>Welcome to the LyricBase.</p>
        <p>Your OTP for registration is: <strong>${otp}</strong></p>
        <p>If you did not request this, please ignore this email and your registration will remain unchanged.</p>
        <p>Thank you.</p>
      `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Error sending email" });
            }
            console.log("Email sent: " + info.response);
            //new otp send success message to user
            res.status(200).json({ message: "OTP sent successfully" });
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while sending OTP" });
    }
});
exports.sendOtp = sendOtp;
//controller to verify otp 
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //validate request body
        if (!req.body.email || !req.body.otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }
        const { email, otp } = req.body;
        //convert otp to number
        const otpNumber = parseInt(otp);
        //fetch user from database
        const userDoc = yield UserModel_1.default.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }
        //get otp from user document
        const userDocOtp = userDoc.otp;
        //check if otp is correct and not expired below 5 minutes
        if (otpNumber !== userDocOtp || Date.now() - userDoc.otpExpiry > 5 * 60 * 1000) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        //return success message
        res.status(200).json({ message: "OTP-verified" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while verifying OTP" });
    }
});
exports.verifyOtp = verifyOtp;
// controller for reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //validate request body
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const { email, password } = req.body;
        console.log("resetPassword");
        console.log("email", email);
        console.log("password ", password);
        //fetch user from database
        const userDoc = yield UserModel_1.default.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }
        //update password
        userDoc.password = password;
        yield userDoc.save();
        //return success message
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while resetting password" });
    }
});
exports.resetPassword = resetPassword;
