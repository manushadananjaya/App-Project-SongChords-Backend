import { Request, Response } from "express";
import mongoose from "mongoose";
import SongList from "../models/SongList"; // Adjust the path to where your songList.ts file is located
import AWS, { Endpoint } from "aws-sdk";
import multer from "multer";
import { sign } from "crypto";
// const multerS3 = require("multer-s3");

// Configure AWS SDK
AWS.config.update({
  region: "eu-north-1", // e.g., 'us-west-2'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// const s3 = new AWS.S3({
//   endpoint: "s3-eu-north-1.amazonaws.com",
//   signatureVersion: "v4",
//   region: process.env.AWS_REGION,
// });

const s3 = new AWS.S3({});


// Function to get a signed URL for an image file
const getSignedUrl = (bucket: string, key: string) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: 60, // URL expires in 60 seconds
  };

  return new Promise<string>((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

// Controller to get a signed URL for an image file
// const getSongImageUrl = async (req: Request, res: Response) => {
//   try {
//     const songId = req.params.id;
//     const song = await SongList.findById(songId);
//     if (!song) {
//       return res.status(404).json({ error: "Song not found" });
//     }

//     const imageUrl = await getSignedUrl("chordsapp", song.imageKey); // Make sure imageKey is the correct key for your image
//     res.status(200).json({ url: imageUrl });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the image URL" });
//   }
// };

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

// Search for a song: if search by title, return the song; if search by artist, return all songs by that artist
const getSong = async (req: Request, res: Response) => {
  try {
    // console.log("getSong");
    const { search, filter } = req.query as {
      search: string;
      filter: "name" | "artist";
    };
    let songs = [] as any;

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
    // Fetch all artists from the database and sort them
    const artists = await SongList.distinct("artist").sort();

    // Return the artists as a response
    res.status(200).json(artists);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching artists" });
  }
};

// Controller to get all songs by a specific artist; request sent with params
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

//get songs by id 
const getSongsById = async (req: Request, res: Response) => {
  try {
    // Fetch the song from the request parameters
    const id = req.params.id;

    // Fetch all songs by the artist from the database
    const songs = await SongList.findById(id);

    // Return the songs as a response
    res.status(200).json(songs);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
}

//get lyrics
const getLyrics = async (req: Request, res: Response) => {
  try {
    // Fetch the song from the request parameters
    const id = req.params.id;

    // Fetch all songs by the artist from the database
    const songs = await SongList.findById(id);

    // Return the songs as a response
    // console.log(songs?.lyrics);
    res.status(200).json(songs?.lyrics); // Add null check before accessing lyrics property

  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
}
//get chords
const getChords = async (req: Request, res: Response) => {
  try {
    // Fetch the song from the request parameters
    const id = req.params.id;

    // Fetch all songs by the artist from the database
    const songs = await SongList.findById(id);

    // Return the songs as a response
    res.status(200).json(songs?.chords); // Add null check before accessing chords property
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};

//controller to send all songList document data to frontend to download
const downloadSongList = async (req: Request, res: Response) => {
  try {
    const songList = await SongList.find();
    res.status(200).json(songList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
}

//controller to get artist count count unique artist in songList
const getArtistCount = async (req: Request, res: Response) => {
  try {
    const artistCount = await SongList.distinct("artist")
    res.status(200).json(artistCount);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching artist count" });
  }
}
  

//controller to get song count
const getSongCount = async (req: Request, res: Response) => {
  try {
    const songCount = await SongList.countDocuments();
    res.status(200).json(songCount);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching song count" });
  }
}


// Export the controller functions
export {
  getAllSongs,
  newChord,
  getSong,
  getAllArtists,
  getArtist,
  getChords,
  getSignedUrl,
  getSongsById,
  getLyrics,
  downloadSongList,
  getSongCount,
  getArtistCount,
};
