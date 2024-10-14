import express from "express";
import { checkCustomer, checkLoggedIn } from "../Controllers/userController.js";
import {
  createBooking,
  getBookingsByEmail,
} from "../Controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", checkLoggedIn, checkCustomer, createBooking);
bookingRouter.get("/", checkLoggedIn, checkCustomer, getBookingsByEmail);

export default bookingRouter;
