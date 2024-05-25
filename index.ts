import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import songRoutes from "./routes/SongRoutes";
import artistRoutes from "./routes/ArtistRoutes";
import authRoutes from "./routes/AuthRoutes";
import playlistRoutes from "./routes/PlayListRoutes";
import userRoutes from "./routes/UserRoutes";

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

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Initialize routes
app.use("/songs", songRoutes);
app.use("/artists", artistRoutes);
app.use("/auth", authRoutes);
app.use("/playlists", playlistRoutes);
app.use("/users", userRoutes); // Corrected this line

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
