import { Router } from "express";
import { getUser } from "../controllers/UserController"; // Adjust the path as necessary
import {requestSong} from "../controllers/UserRequestsController";

const router: Router = Router();

//handle user Requests
router.post("/requestSong", requestSong);

// Use a parameterized route to get a specific user by ID
router.get("/:id", getUser);


export default router;
