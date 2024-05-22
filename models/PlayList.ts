import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the PlayList document
interface IPlayList extends Document {
  title: string;
  songs: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
}

// Define the schema for the PlayList model
const PlayListSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "SongList" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Create the PlayList model
const PlayList = mongoose.model<IPlayList>("PlayList", PlayListSchema);

export default PlayList;
