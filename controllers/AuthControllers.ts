import { Request, Response } from "express";
import UserModel, {UserModelDocument} from "../models/UserModel";
import jwt from "jsonwebtoken";

const generateAccessToken = (payload: any): string => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { 
        expiresIn: "1h",
    });
}

const generateRefreshToken = async (payload: any): Promise<string> => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "7d",
    });
}
    

// Controller to sign up a new user
const userSignUp = async (req: Request, res: Response) => {
  try {
    console.log("userSignUp");

    //check if user already exists
    const userExists = await UserModel.findOne({ email: req .body.email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user from the request body
    const user = new UserModel(req.body);

    // Generate an access token
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = await generateRefreshToken({ _id: user._id });

    
    // Save the user to the database
    await user.save();

    // Return the user and access token as a response
    res.status(201).json({ user, accessToken , refreshToken});
  } catch (error) {
    // Handle any errors that occur during the process
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

    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = await generateRefreshToken({ _id: user._id });

    if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
    }

    // Return the user as a response
    res.status(200).json({ user, accessToken, refreshToken });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while signing in" });
  }
};

const refreshUser = async (req: Request, res: Response) => { 
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required" });
        }

        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error(
                "REFRESH_TOKEN_SECRET is not defined in the environment variables"
            );
        }

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as any;
        const user = await UserModel.findById(payload._id);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = generateAccessToken({ _id: user._id });
        const newRefreshToken = await generateRefreshToken({ _id: user._id });

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while refreshing the user" });
    }
}

export { userSignUp, userSignIn , refreshUser};
