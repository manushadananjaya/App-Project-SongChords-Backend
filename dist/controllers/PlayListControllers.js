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
exports.deleteSavedPlayList = exports.getSavedPlayLists = exports.savePlayList = exports.searchPlayList = exports.deletePlayList = exports.updatePlayList = exports.getPlayList = exports.createPlayList = exports.getAllPlayLists = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PlayList_1 = __importDefault(require("../models/PlayList"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
// Controller to get all playlists
const getAllPlayLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const playlists = yield PlayList_1.default.find({ user: user._id })
            .populate("songs")
            .populate("user");
        res.status(200).json(playlists);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching playlists" });
    }
});
exports.getAllPlayLists = getAllPlayLists;
// Controller to create a new playlist
const createPlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { title, songs } = req.body;
        const playlist = new PlayList_1.default({ title, songs, user: user._id });
        yield playlist.save();
        res.status(201).json(playlist);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while creating a new playlist" });
    }
});
exports.createPlayList = createPlayList;
// Fetch the playlist with the provided ID
const getPlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid playlist ID" });
        }
        const playlist = yield PlayList_1.default.findById(id)
            .populate("songs")
            .populate("user");
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        return res.status(200).json(playlist);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while fetching the playlist" });
    }
});
exports.getPlayList = getPlayList;
// Controller to update a playlist by ID
const updatePlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid playlist ID" });
            return;
        }
        const playlist = yield PlayList_1.default.findById(id);
        if (!playlist) {
            res.status(404).json({ error: "Playlist not found" });
            return;
        }
        playlist.set(updateData);
        yield playlist.save();
        res.status(200).json(playlist);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while updating the playlist" });
    }
});
exports.updatePlayList = updatePlayList;
// Controller to delete a playlist by ID
const deletePlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid playlist ID" });
            return;
        }
        const playlist = yield PlayList_1.default.findById(id);
        if (!playlist) {
            res.status(404).json({ error: "Playlist not found" });
            return;
        }
        yield PlayList_1.default.deleteOne({ _id: id });
        res.status(200).json({ message: "Playlist deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the playlist" });
    }
});
exports.deletePlayList = deletePlayList;
// Controller to search for a playlist
const searchPlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        const { search } = req.query;
        if (!search) {
            res.status(400).json({ error: "Search query is required" });
            return;
        }
        // Search for playlists that match the search query and not created by the user
        const playlists = yield PlayList_1.default.find({
            title: { $regex: search, $options: "i" },
            user: { $ne: user._id },
        });
        if (!playlists.length) {
            res.status(404).json({ error: "Playlist not found" });
            return;
        }
        res.status(200).json(playlists);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while searching for the playlist" });
    }
});
exports.searchPlayList = searchPlayList;
// Controller to save a playlist to user
const savePlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { playlistId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(playlistId)) {
            res.status(400).json({ error: "Invalid playlist ID" });
            return;
        }
        const playlist = yield PlayList_1.default.findById(playlistId);
        if (!playlist) {
            res.status(404).json({ error: "Playlist not found" });
            return;
        }
        const userPlaylist = yield UserModel_1.default.findById(user._id);
        if (!userPlaylist) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (!userPlaylist.savedPlaylists.includes(String(playlist._id))) {
            userPlaylist.savedPlaylists.push(String(playlist._id));
            yield userPlaylist.save();
        }
        res.status(200).json({ message: "Playlist saved successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while saving the playlist" });
    }
});
exports.savePlayList = savePlayList;
// Controller to get all saved playlists
const getSavedPlayLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        console.log("user", user);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const userPlaylist = yield UserModel_1.default.findById(user._id).populate("savedPlaylists");
        if (!userPlaylist) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(userPlaylist.savedPlaylists);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching the saved playlists" });
    }
});
exports.getSavedPlayLists = getSavedPlayLists;
// delete saved playlist 
const deleteSavedPlayList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const token = (_f = req.headers.authorization) === null || _f === void 0 ? void 0 : _f.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { playlistId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(playlistId)) {
            res.status(400).json({ error: "Invalid playlist ID" });
            return;
        }
        const userPlaylist = yield UserModel_1.default.findById(user._id);
        if (!userPlaylist) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        userPlaylist.savedPlaylists = userPlaylist.savedPlaylists.filter((id) => id.toString() !== playlistId);
        yield userPlaylist.save();
        res
            .status(200)
            .json({ message: "Playlist removed from saved successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({
            error: "An error occurred while removing the playlist from saved",
        });
    }
});
exports.deleteSavedPlayList = deleteSavedPlayList;
