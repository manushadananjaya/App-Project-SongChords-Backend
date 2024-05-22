import jwt from "jsonwebtoken";

interface Payload {
  [key: string]: any;
}

const generateAccessToken = (payload: Payload): string => {
  console.log("payload", payload);

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in the environment variables"
    );
  }

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export { generateAccessToken };
