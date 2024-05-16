import { Router } from "express";
import { userSignIn, userSignUp } from "../controllers/AuthControllers"; // Adjust the path as necessary

const router: Router = Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);

export default router;
