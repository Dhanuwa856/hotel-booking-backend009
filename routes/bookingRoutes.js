import express from "express";
import {
  checkAdmin,
  checkCustomer,
  checkLoggedIn,
} from "../Controllers/userController.js";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getBookingsByEmail,
  updateBooking,
} from "../Controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", checkLoggedIn, checkCustomer, createBooking);
bookingRouter.get("/", checkLoggedIn, checkCustomer, getBookingsByEmail);
bookingRouter.get("/all", checkLoggedIn, checkAdmin, getAllBookings);
bookingRouter.put(
  "/cancel/:bookingId/",
  checkLoggedIn,
  checkCustomer,
  cancelBooking
);
bookingRouter.put(
  "/change/:booking_id/",
  checkLoggedIn,
  checkAdmin,
  updateBooking
);
export default bookingRouter;
