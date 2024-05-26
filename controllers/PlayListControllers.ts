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

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const playlists = await PlayList.find({ user: user._id })
      .populate("songs")
      .populate("user");

    res.status(200).json(playlists);
  } catch (error) {
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

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, songs } = req.body;
    const playlist = new PlayList({ title, songs, user: user._id });
    await playlist.save();

    res.status(201).json(playlist);
  } catch (error) {
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    const playlist = await PlayList.findById(id)
      .populate("songs")
      .populate("user");

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    return res.status(200).json(playlist);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the playlist" });
  }
};

// Controller to update a playlist by ID
const updatePlayList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const playlist = await PlayList.findById(id);

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    playlist.set(updateData);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the playlist" });
  }
};

// Controller to delete a playlist by ID
const deletePlayList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const playlist = await PlayList.findById(id);

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    await PlayList.deleteOne({ _id: id });
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the playlist" });
  }
};

// Controller to search for a playlist
const searchPlayList = async (req: Request, res: Response): Promise<void> => {
  try {

    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    const { search } = req.query as { search: string };

    

    if (!search) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    // Search for playlists that match the search query and not created by the user
    const playlists = await PlayList.find({
      title: { $regex: search, $options: "i" },
      user: { $ne: user._id },
    });



    if (!playlists.length) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    res.status(200).json(playlists);

    
    
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for the playlist" });
  }
};

// Controller to save a playlist to user
const savePlayList = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { playlistId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const playlist = await PlayList.findById(playlistId);

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    const userPlaylist = await User.findById(user._id);
    if (!userPlaylist) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!userPlaylist.savedPlaylists.includes(String(playlist._id))) {
      userPlaylist.savedPlaylists.push(String(playlist._id));
      await userPlaylist.save();
    }

    res.status(200).json({ message: "Playlist saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving the playlist" });
  }
};

// Controller to get all saved playlists
const getSavedPlayLists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    console.log("user", user);

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userPlaylist = await User.findById(user._id).populate(
      "savedPlaylists"
    );

    if (!userPlaylist) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(userPlaylist.savedPlaylists);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the saved playlists" });
  }
};

// delete saved playlist 
const deleteSavedPlayList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const user = Jwt.decode(token) as { _id: string };

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const userPlaylist = await User.findById(user._id);

    if (!userPlaylist) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    userPlaylist.savedPlaylists = userPlaylist.savedPlaylists.filter(
      (id) => id.toString() !== playlistId
    );
    await userPlaylist.save();

    res
      .status(200)
      .json({ message: "Playlist removed from saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while removing the playlist from saved",
      });
  }
};


export {
  getAllPlayLists,
  createPlayList,
  getPlayList,
  updatePlayList,
  deletePlayList,
  searchPlayList,
  savePlayList,
  getSavedPlayLists,
    deleteSavedPlayList
};
