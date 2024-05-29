"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongsById = exports.getSignedUrl = exports.getSongImageUrl = exports.getArtist = exports.getAllArtists = exports.getSong = exports.newChord = exports.getAllSongs = void 0;
const SongList_1 = __importDefault(require("../models/SongList")); // Adjust the path to where your songList.ts file is located
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// const multerS3 = require("multer-s3");
// Configure AWS SDK
aws_sdk_1.default.config.update({
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
const s3 = new aws_sdk_1.default.S3({});
// Function to get a signed URL for an image file
const getSignedUrl = (bucket, key) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Expires: 60, // URL expires in 60 seconds
    };
    return new Promise((resolve, reject) => {
        s3.getSignedUrl("getObject", params, (err, url) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(url);
            }
        });
    });
};
exports.getSignedUrl = getSignedUrl;
// Controller to get a signed URL for an image file
const getSongImageUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songId = req.params.id;
        const song = yield SongList_1.default.findById(songId);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        const imageUrl = yield getSignedUrl("chordsapp", song.imageKey); // Make sure imageKey is the correct key for your image
        res.status(200).json({ url: imageUrl });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching the image URL" });
    }
});
exports.getSongImageUrl = getSongImageUrl;
// Controller to get all songs from the database
const getAllSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllSongs");
    try {
        // Fetch all songs from the database
        const songs = yield SongList_1.default.find();
        // Return the songs as a response
        res.status(200).json(songs);
    }
    catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: "An error occurred while fetching songs" });
    }
});
exports.getAllSongs = getAllSongs;
const newChord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new song from the request body
        const song = new SongList_1.default(req.body);
        // Save the song to the database
        yield song.save();
        // Return the song as a response
        res.status(201).json(song);
    }
    catch (error) {
        // Handle any errors that occur during the process
        res
            .status(500)
            .json({ error: "An error occurred while creating a new song" });
    }
});
exports.newChord = newChord;
// Search for a song: if search by title, return the song; if search by artist, return all songs by that artist
const getSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("getSong");
        const { search, filter } = req.query;
        let songs = [];
        if (filter === "name") {
            // Search for songs by title
            songs = yield SongList_1.default.find({ title: new RegExp(search, "i") });
        }
        else if (filter === "artist") {
            // Search for songs by artist
            songs = yield SongList_1.default.find({ artist: new RegExp(search, "i") });
        }
        else {
            // Return an empty array if no valid filter is provided
            songs = [];
        }
        // Return the songs as a response
        res.status(200).json(songs);
    }
    catch (error) {
        // Handle any errors that occur during the process
        res
            .status(500)
            .json({ error: "An error occurred while searching for a song" });
    }
});
exports.getSong = getSong;
exports.default = getSong;
// Controller to get all artists from the database
const getAllArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all artists from the database
        const artists = yield SongList_1.default.distinct("artist");
        // Return the artists as a response
        res.status(200).json(artists);
    }
    catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: "An error occurred while fetching artists" });
    }
});
exports.getAllArtists = getAllArtists;
// Controller to get all songs by a specific artist; request sent with params
const getArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the artist from the request parameters
        const artist = req.params.artist;
        // Fetch all songs by the artist from the database
        const songs = yield SongList_1.default.find({ artist });
        // Return the songs as a response
        res.status(200).json(songs);
    }
    catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: "An error occurred while fetching songs" });
    }
});
exports.getArtist = getArtist;
//get songs by id 
const getSongsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the song from the request parameters
        const id = req.params.id;
        // Fetch all songs by the artist from the database
        const songs = yield SongList_1.default.findById(id);
        // Return the songs as a response
        res.status(200).json(songs);
    }
    catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: "An error occurred while fetching songs" });
    }
});
exports.getSongsById = getSongsById;
