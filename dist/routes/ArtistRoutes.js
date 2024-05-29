"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SongListControllers_1 = require("../controllers/SongListControllers"); // Adjust the path as necessary
const router = (0, express_1.Router)();
router.get("/", SongListControllers_1.getAllArtists);
//get songs by artist request send with params
router.get("/:artist", SongListControllers_1.getArtist);
exports.default = router;
