import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
} from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getUsers);
userRouter.post("/login", loginUser);

export default userRouter;
