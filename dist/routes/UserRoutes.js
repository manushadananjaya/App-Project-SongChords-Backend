"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController"); // Adjust the path as necessary
const router = (0, express_1.Router)();
// Use a parameterized route to get a specific user by ID
router.get("/:id", UserController_1.getUser);
exports.default = router;
