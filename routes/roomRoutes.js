import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomByNumber,
  updateRoom,
} from "../Controllers/roomController.js";
import { checkAdmin, checkLoggedIn } from "../Controllers/userController.js";
import { get } from "mongoose";

const roomRouter = express.Router();

roomRouter.post("/", checkLoggedIn, checkAdmin, createRoom);
roomRouter.get("/", getAllRooms);
roomRouter.get("/:roomNumber", getRoomByNumber);
roomRouter.put("/:roomNumber", checkLoggedIn, checkAdmin, updateRoom);
roomRouter.delete("/:roomNumber", checkLoggedIn, checkAdmin, deleteRoom);

export default roomRouter;
