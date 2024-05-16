import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import songRoutes from "./routes/SongRoutes" // Adjust the path as necessary
import artistRoutes from "./routes/ArtistRoutes" // Adjust the path as necessary

dotenv.config();

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

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript + Node.js + Express Server");
});

// Initialize routes
app.use("/songs", songRoutes);
app.use("/artists", artistRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
