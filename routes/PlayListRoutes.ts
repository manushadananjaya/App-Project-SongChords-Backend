import { Router } from "express";
import {
  createPlayList,
  getAllPlayLists,
  getPlayList,
  updatePlayList,
  deletePlayList,
  searchPlayList,
  savePlayList,
    getSavedPlayLists
} from "../controllers/PlayListControllers";

const router: Router = Router();

router.get("/", getAllPlayLists);
router.post("/", createPlayList);
router.get("/saved", getSavedPlayLists);
router.get("/playlist/search", searchPlayList);

router.get("/:id", getPlayList);

router.put("/:id", updatePlayList);
router.delete("/:id", deletePlayList);
router.post("/save", savePlayList);


// Ensure this route is placed before the get by ID route to avoid conflicts



export default router;
