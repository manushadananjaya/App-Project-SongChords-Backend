import { Request, Response } from "express";
import UserModel, { UserModelDocument } from "../models/UserModel";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Function to generate an access token
const generateAccessToken = (payload: any): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in the environment variables"
    );
  }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// Function to generate a refresh token
const generateRefreshToken = (payload: any): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in the environment variables"
    );
  }
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Controller to sign up a new user
const userSignUp = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const userExists = await UserModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user from the request body
    const user = new UserModel(req.body);

    // Generate tokens
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });

    // Save the user to the database
    await user.save();

    // Return the user and tokens as a response
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new user" });
  }
};

// Controller to sign in an existing user
const userSignIn = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Fetch the user with the provided email
    const user: UserModelDocument | null = await UserModel.findOne({
      email: req.body.email,
    });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password is correct
    const isMatch: boolean = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });

    // Return the user and tokens as a response
    res.status(200).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while signing in" });
  }
};

// Controller to refresh tokens
const refreshUser = async (req: Request, res: Response) => {
  try {
    console.log("refreshUser");

    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as any;
    const user = await UserModel.findById(payload._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newAccessToken = generateAccessToken({ _id: user._id });
    const newRefreshToken = generateRefreshToken({ _id: user._id });

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while refreshing the tokens" });
  }
};

//controller to change password
const changePassword = async (req: Request, res: Response) => {
  try {

    // validate request body
    if (!req.body.newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const {newPassword} = req.body;

    //get user id from token
    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = jwt.decode(token) as { _id: string };
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //fetch user from database
    const userDoc = await UserModel.findById(user._id);
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    //update password
    userDoc.password = newPassword;
    await userDoc.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while changing password" });
  }
}

//controller to get user email from request and send otp to email for password reset
const sendOtp = async (req: Request, res: Response) => {
  try {
    //validate request body
    if (!req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { email } = req.body;



    //fetch user from database
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    //generate otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    //save otp to user document with expiry time of 5 minutes from now
    userDoc.otp = otp;
    userDoc.otpExpiry = Date.now() + 5 * 60 * 1000;

    await userDoc.save();

    //send otp to user email
    // Send the OTP via email
    const transporter = nodemailer.createTransport({
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

    
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending OTP" });
  }
}

//controller to verify otp 
const verifyOtp = async (req: Request, res: Response) => {
  try {
    //validate request body
    if (!req.body.email || !req.body.otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const { email, otp } = req.body;


    //convert otp to number
    const otpNumber = parseInt(otp);

    

    //fetch user from database
    const userDoc = await UserModel.findOne({ email }); 
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    //get otp from user document
    
    const userDocOtp = userDoc.otp;

    
    //check if otp is correct and not expired below 5 minutes
    if (otpNumber !== userDocOtp || Date.now() - userDoc.otpExpiry > 5 * 60 * 1000){
      return res.status(400).json({ error: "Invalid OTP" });
    }

    
    //return success message
    res.status(200).json({ message: "OTP-verified" });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while verifying OTP" });
  }
}

// controller for reset password
const resetPassword = async (req: Request, res: Response) => {
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
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    //update password
    userDoc.password = password;
    await userDoc.save();

    //return success message
    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while resetting password" });
  }
}



export { userSignUp, userSignIn, refreshUser , changePassword, sendOtp , verifyOtp , resetPassword};
