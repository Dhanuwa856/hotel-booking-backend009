import express from "express";
import {
  checkAdmin,
  checkCustomer,
  checkEmailVerified,
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

bookingRouter.post(
  "/",
  checkLoggedIn,
  checkCustomer,
  checkEmailVerified,
  createBooking
);
bookingRouter.get("/", checkLoggedIn, checkCustomer, getBookingsByEmail);
bookingRouter.get("/all", getAllBookings); // for test
// bookingRouter.get("/all", checkLoggedIn, checkAdmin, getAllBookings); // correct code
bookingRouter.put(
  "/cancel/:bookingId/",
  checkLoggedIn,
  checkCustomer,
  checkEmailVerified,
  cancelBooking
);
bookingRouter.put(
  "/change/:booking_id/",
  // checkLoggedIn,
  // checkAdmin,
  updateBooking
);
export default bookingRouter;
