import jwt from "jsonwebtoken";
import UserModel from "../../models/UserModel";

interface Payload {
  _id: string;
  [key: string]: any;
}

const generateRefreshToken = async (payload: Payload): Promise<string> => {
  console.log("payload", payload);

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in the environment variables"
    );
  }

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

    const user = await UserModel.findById(payload._id );
    if (!user) {
      throw new Error("User not found");
    }
    user.refreshToken = refreshToken;
    await user.save();



  

  return refreshToken;
};

export { generateRefreshToken };
