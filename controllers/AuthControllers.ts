import { Request, Response } from "express";
import UserModel, {UserModelDocument} from "../models/UserModel";

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

    
    // Save the user to the database
    await user.save();

    // Return the user as a response
    res.status(201).json(user);
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

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Return the user as a response
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while signing in" });
  }
};

export { userSignUp, userSignIn };
