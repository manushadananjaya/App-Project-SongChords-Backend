// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI as string;
mongoose
  .connect(mongoUri, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  });


const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript + Node.js + Express Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
