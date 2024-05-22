import { Router } from "express";
import {
  getAllArtists,
    getArtist,
} from "../controllers/SongListControllers"; // Adjust the path as necessary

const router: Router = Router();

router.get("/", getAllArtists);
//get songs by artist request send with params
router.get("/:artist", getArtist);

export default router;
