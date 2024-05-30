import { Router } from "express";
import {
  refreshUser,
  userSignIn,
  userSignUp,
  changePassword,
  sendOtp,
  verifyOtp,
  resetPassword,
  checkUserName,
} from "../controllers/AuthControllers"; // Adjust the path as necessary

const router: Router = Router();


router.get("/checkUserName/:username", checkUserName);


router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.post("/refresh", refreshUser);
router.put("/changePassword", changePassword);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.put("/resetPassword", resetPassword);


export default router;
