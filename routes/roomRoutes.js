import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomByNumber,
  updateRoom,
} from "../Controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getAllRooms);
roomRouter.get("/:roomNumber", getRoomByNumber);
roomRouter.put("/:roomNumber", updateRoom);
roomRouter.delete("/:roomNumber", deleteRoom);

export default roomRouter;
