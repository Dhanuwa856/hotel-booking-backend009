import express from "express";
import { createRoom, getAllRooms } from "../Controllers/roomController.js";

const roomRouter = express.Router();

// POST route to create a room (Admin only)
roomRouter.post("/", createRoom);
roomRouter.get("/", getAllRooms);

export default roomRouter;
