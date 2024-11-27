import express from "express";
import {
  blockUser,
  checkAdmin,
  checkCustomer,
  checkLoggedIn,
  createUser,
  getAdminStats,
  getUsers,
  loginUser,
  updateUser,
  verifyEmail,
} from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.get("/", checkLoggedIn, checkAdmin, getUsers);
userRouter.get("/stats", checkLoggedIn, checkAdmin, getAdminStats);
userRouter.post("/login", loginUser);
userRouter.put("/block/:email", checkLoggedIn, checkAdmin, blockUser);
userRouter.put("/:userEmail", checkLoggedIn, checkCustomer, updateUser);

export default userRouter;
