import express from "express";
import {
  checkAdmin,
  checkCustomer,
  checkEmailVerified,
  checkLoggedIn,
} from "../Controllers/userController.js";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackByUser,
  updateFeedbackStatus,
} from "../Controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post(
  "/",
  checkLoggedIn,
  checkCustomer,
  checkEmailVerified,
  createFeedback
);
feedbackRouter.get("/", checkLoggedIn, checkCustomer, getFeedbackByUser);
feedbackRouter.get("/all", checkLoggedIn, checkAdmin, getAllFeedback); // real code
feedbackRouter.put(
  "/:feedback_id",
  checkLoggedIn,
  checkAdmin,
  updateFeedbackStatus
);

export default feedbackRouter;
