import express from "express";
import {
  blockUser,
  checkAdmin,
  checkLoggedIn,
  createUser,
  getUsers,
  loginUser,
} from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getUsers);
userRouter.post("/login", loginUser);
userRouter.put("/block/:email", checkLoggedIn, checkAdmin, blockUser);

export default userRouter;
