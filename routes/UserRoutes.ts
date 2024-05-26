import { Router } from "express";
import { getUser } from "../controllers/UserController"; // Adjust the path as necessary

const router: Router = Router();

// Use a parameterized route to get a specific user by ID
router.get("/:id", getUser);

export default router;
