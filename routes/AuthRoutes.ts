import { Router } from "express";
import { refreshUser, userSignIn, userSignUp } from "../controllers/AuthControllers"; // Adjust the path as necessary

const router: Router = Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.post("/refresh", refreshUser);

export default router;
