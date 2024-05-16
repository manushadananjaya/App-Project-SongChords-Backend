import { Request, Response } from "express";
import mongoose from "mongoose";
import SongList from "../models/SongList"; // Adjust the path to where your songList.ts file is located

// Controller to get all songs from the database
const getAllSongs = async (req: Request, res: Response) => {
  console.log("getAllSongs");
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

//Search for a if search by title return the song if search by artist return all songs by that artist

const getSong = async (req: Request, res: Response) => {
  try {
    const { search, filter } = req.query as {
      search: string;
      filter: "name" | "artist";
    };
    let songs  = [] as any;

    if (filter === "name") {
      // Search for songs by title
      songs = await SongList.find({ title: new RegExp(search, "i") });
    } else if (filter === "artist") {
      // Search for songs by artist
      songs = await SongList.find({ artist: new RegExp(search, "i") });
    } else {
      // Return an empty array if no valid filter is provided
      songs = [];
    }

    // Return the songs as a response
    res.status(200).json(songs);
  } catch (error) {
    // Handle any errors that occur during the process
    res
      .status(500)
      .json({ error: "An error occurred while searching for a song" });
  }
};

export default getSong;


// Controller to get all artists from the database
const getAllArtists = async (req: Request, res: Response) => {
  try {
    // Fetch all artists from the database
    const artists = await SongList.distinct("artist");

    // Return the artists as a response
    res.status(200).json(artists);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching artists" });
  }
};

// Controller to get all songs by a specific artist request send with params
const getArtist = async (req: Request, res: Response) => {
  try {
    // Fetch the artist from the request parameters
    const artist = req.params.artist;

    // Fetch all songs by the artist from the database
    const songs = await SongList.find({ artist });

    // Return the songs as a response
    res.status(200).json(songs);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};


// Export the controller functions
export { getAllSongs, newChord, getSong, getAllArtists, getArtist};
