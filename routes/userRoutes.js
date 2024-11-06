import express from "express";
import {
  blockUser,
  checkAdmin,
  checkLoggedIn,
  createUser,
  getAdminStats,
  getUsers,
  loginUser,
} from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", checkLoggedIn, checkAdmin, getUsers);
userRouter.get("/stats", checkLoggedIn, checkAdmin, getAdminStats);
userRouter.post("/login", loginUser);
userRouter.put("/block/:email", checkLoggedIn, checkAdmin, blockUser);

export default userRouter;
