import { Request, Response } from "express";
import mongoose from "mongoose";
import SongList from "../models/SongList"; // Adjust the path to where your songList.ts file is located

// Controller to get all songs from the database
const getAllSongs = async (req: Request, res: Response) => {
  try {
    // Fetch all songs from the database
    const songs = await SongList.find();

    // Return the songs as a response
    res.status(200).json(songs);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};

const newChord = async (req: Request, res: Response) => {
  try {
    // Create a new song from the request body
    const song = new SongList(req.body);

    // Save the song to the database
    await song.save();

    // Return the song as a response
    res.status(201).json(song);
  } catch (error) {
    // Handle any errors that occur during the process
    res
      .status(500)
      .json({ error: "An error occurred while creating a new song" });
  }
};

// Export the controller functions
export { getAllSongs, newChord };
