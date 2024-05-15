import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the SongList document
interface ISongList extends Document {
  title: string;
  artist: string;
}

// Define the schema for the SongList model
const SongListSchema: Schema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
});

// Create the SongList model
const SongList = mongoose.model<ISongList>("SongList", SongListSchema);

export default SongList;
