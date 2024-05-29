"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthControllers_1 = require("../controllers/AuthControllers"); // Adjust the path as necessary
const router = (0, express_1.Router)();
router.post("/signup", AuthControllers_1.userSignUp);
router.post("/signin", AuthControllers_1.userSignIn);
router.post("/refresh", AuthControllers_1.refreshUser);
router.put("/changePassword", AuthControllers_1.changePassword);
router.post("/sendOtp", AuthControllers_1.sendOtp);
router.post("/verifyOtp", AuthControllers_1.verifyOtp);
router.put("/resetPassword", AuthControllers_1.resetPassword);
exports.default = router;
