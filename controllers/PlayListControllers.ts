import { Request, Response } from "express";
import mongoose from "mongoose";
import PlayList from "../models/PlayList";
import Jwt from "jsonwebtoken";
import User from "../models/UserModel";

// Controller to get all playlists
const getAllPlayLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };
    
    

    //check access token expired or not
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    
    // Fetch all playlists from the database that belong to the user
    const playlists = await PlayList.find({ user: user._id })
      .populate("songs")
      .populate("user");

    // Return the playlists as a response
    res.status(200).json(playlists);
  } catch (error) {
    // Handle any errors that occur during the process
    res
      .status(500)
      .json({ error: "An error occurred while fetching playlists" });
  }
};

// Controller to create a new playlist
const createPlayList = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const token = req.headers.authorization?.split(" ")[1] as string;

    const user = Jwt.decode(token) as { _id: string };

    
   

    const { title, songs } = req.body;

    // Create a new playlist from the request body
    const playlist = new PlayList({ title, songs, user });

    // Save the playlist to the database
    await playlist.save();

    // Return the playlist as a response
    res.status(201).json(playlist);
  } catch (error) {
    // Handle any errors that occur during the process
    res
      .status(500)
      .json({ error: "An error occurred while creating a new playlist" });
  }
};

// Fetch the playlist with the provided ID
const getPlayList = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {

    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    //validate access 
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }


    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    // Fetch the playlist with the provided ID
    const playlist = await PlayList.findById(id)
      .populate("songs")
      .populate("user");

    // Check if the playlist exists
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Return the playlist as a response
    return res.status(200).json(playlist);
  } catch (error) {
    // Handle any errors that occur during the process
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the playlist" });
  }
};

// Controller to update a playlist by ID
const updatePlayList = async (req: Request, res: Response): Promise<void> => {
  try {

    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    //validate access
    if (!user) {
         res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const { id } = req.params;
    const updateData = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    // Fetch the playlist with the provided ID
    const playlist = await PlayList.findById(id);

    // Check if the playlist exists
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    // Update the playlist with the new data
    playlist.set(updateData);

    // Save the updated playlist to the database
    await playlist.save();

    // Return the updated playlist as a response
    res.status(200).json(playlist);
  } catch (error) {
    // Handle any errors that occur during the process
    res
      .status(500)
      .json({ error: "An error occurred while updating the playlist" });
  }
};

// Controller to delete a playlist by ID
const deletePlayList = async (req: Request, res: Response): Promise<void> => {
  try {
    // console.log("deletePlayList");
    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    //validate access
    if (!user) {
         res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    // Fetch the playlist with the provided ID
    const playlist = await PlayList.findById(id);

    // Check if the playlist exists
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    // Delete the playlist from the database
    await PlayList.deleteOne({ _id: id });

    // Return a success message as a response
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    res
      .status(500)
      .json({ error: "An error occurred while deleting the playlist" });
  }
};

//search for a playlist
const searchPlayList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query as { search: string };

    if (!search) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const playlists = await PlayList.find({
      title: { $regex: search, $options: "i" },
    });

    if (!playlists.length) {
        res.status(404).json({ error: "Playlist not found" });
        return;
    }


    res.status(200).json({ playlists });


  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for the playlist" });
  }
};


export {
  getAllPlayLists,
  createPlayList,
  getPlayList,
  updatePlayList,
  deletePlayList,
  searchPlayList,

};
