"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SongListControllers_1 = require("../controllers/SongListControllers"); // Adjust the path as necessary
const router = (0, express_1.Router)();
router.get("/", SongListControllers_1.getAllSongs);
router.post("/newChord", SongListControllers_1.newChord);
//search for a song
router.get("/song", SongListControllers_1.getSong);
//get signed url
router.get("/song/:id/image", SongListControllers_1.getSongImageUrl);
//get song by id
router.get("/song/:id", SongListControllers_1.getSongsById);
exports.default = router;
