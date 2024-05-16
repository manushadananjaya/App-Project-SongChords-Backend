import { Router } from "express";
import { getAllSongs, newChord,getSong} from "../controllers/SongListControllers"; // Adjust the path as necessary

const router: Router = Router();

router.get("/", getAllSongs);
router.post("/newChord", newChord);
//search for a song
router.get("/song", getSong);


export default router;
