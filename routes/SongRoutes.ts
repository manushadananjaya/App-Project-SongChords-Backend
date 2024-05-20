import { Router } from "express";
import {
  getAllSongs,
  newChord,
  getSong,
  getSignedUrl,
  getSongImageUrl,
} from "../controllers/SongListControllers"; // Adjust the path as necessary

const router: Router = Router();

router.get("/", getAllSongs);
router.post("/newChord", newChord);
//search for a song
router.get("/song", getSong);
//get signed url
router.get("/song/:id/image", getSongImageUrl);


export default router;
