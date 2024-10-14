import express from "express";
import {
  checkAdmin,
  checkCustomer,
  checkLoggedIn,
} from "../Controllers/userController.js";
import {
  createBooking,
  getAllBookings,
  getBookingsByEmail,
} from "../Controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", checkLoggedIn, checkCustomer, createBooking);
bookingRouter.get("/", checkLoggedIn, checkCustomer, getBookingsByEmail);
bookingRouter.get("/all", checkLoggedIn, checkAdmin, getAllBookings);

export default bookingRouter;
