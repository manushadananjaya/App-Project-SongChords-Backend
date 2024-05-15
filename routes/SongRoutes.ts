import { Router } from "express";
import { getAllSongs, newChord } from "../controllers/SongListControllers"; // Adjust the path as necessary

const router: Router = Router();

router.get("/", getAllSongs);
router.post("/newChord", newChord);

export default router;
