import { Router } from "express";
import {
  createPlayList,
  getAllPlayLists,
  getPlayList,
  updatePlayList,
  deletePlayList,
  searchPlayList,
  savePlayList,
  getSavedPlayLists,
  deleteSavedPlayList,
} from "../controllers/PlayListControllers";

const router: Router = Router();

router.get("/", getAllPlayLists);
router.post("/", createPlayList);
router.get("/saved", getSavedPlayLists);
router.delete("/saved/:playlistId", deleteSavedPlayList); 
router.get("/playlist/search", searchPlayList);

router.get("/:id", getPlayList);
router.put("/:id", updatePlayList);
router.delete("/:id", deletePlayList);

router.post("/save", savePlayList);

export default router;
