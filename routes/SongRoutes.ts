import { Router } from "express";
import {
  getAllSongs,
  newChord,
  getSong,
  getChords,
  // getSongImageUrl,
  getSongsById,
  getLyrics,
  downloadSongList,
} from "../controllers/SongListControllers"; // Adjust the path as necessary

const router: Router = Router();

router.get("/", getAllSongs);
router.post("/newChord", newChord);
//search for a song
router.get("/song", getSong);
//get signed url
// router.get("/song/:id/image", getSongImageUrl);
//get lyrics
router.get("/song/:id/lyrics", getLyrics);
//get Chords
router.get("/song/:id/chords", getChords);

//get song by id
router.get("/song/:id", getSongsById);

//download songList
router.get("/download", downloadSongList);


export default router;
