import { Router } from "express";
import {
  getAllArtists,
  getArtist,
  getArtistCount,
} from "../controllers/SongListControllers"; // Adjust the path as necessary

const router: Router = Router();

//get artist count
router.get("/artistCount", getArtistCount);

router.get("/", getAllArtists);
//get songs by artist request send with params
router.get("/:artist", getArtist);


export default router;
