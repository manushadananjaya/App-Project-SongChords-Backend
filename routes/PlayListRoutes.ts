import { Router } from "express";
import {
  createPlayList,
  getAllPlayLists,
  getPlayList,
  updatePlayList,
  deletePlayList,
  searchPlayList,
} from "../controllers/PlayListControllers";

const router: Router = Router();

router.get("/", getAllPlayLists);
router.post("/", createPlayList);
router.get("/:id", getPlayList);
router.put("/:id", updatePlayList);
router.delete("/:id", deletePlayList);

// Ensure this route is placed before the get by ID route to avoid conflicts
router.get("/playlist/search", searchPlayList);

export default router;
