import { Request, Response } from "express";
import UserModel, { UserModelDocument } from "../models/UserModel";
import jwt from "jsonwebtoken";

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
    console.log("userSignUp");

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

export { userSignUp, userSignIn, refreshUser };
