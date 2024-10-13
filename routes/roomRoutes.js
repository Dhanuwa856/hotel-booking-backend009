import express from "express";
import { createRoom } from "../Controllers/roomController.js";

const roomRouter = express.Router();

// POST route to create a room (Admin only)
roomRouter.post("/", createRoom);

export default roomRouter;
