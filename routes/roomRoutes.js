import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomByNumber,
} from "../Controllers/roomController.js";

const roomRouter = express.Router();

// POST route to create a room (Admin only)
roomRouter.post("/", createRoom);
roomRouter.get("/", getAllRooms);
roomRouter.get("/:roomNumber", getRoomByNumber);

export default roomRouter;
