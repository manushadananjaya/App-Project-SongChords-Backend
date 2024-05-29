"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for the PlayList model
const PlayListSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    songs: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "SongList" }],
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
});
// Create the PlayList model
const PlayList = mongoose_1.default.model("PlayList", PlayListSchema);
exports.default = PlayList;
