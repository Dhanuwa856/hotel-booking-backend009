import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomByNumber,
  updateRoom,
} from "../Controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getAllRooms);
roomRouter.get("/:roomNumber", getRoomByNumber);
roomRouter.put("/:roomNumber", updateRoom);

export default roomRouter;
