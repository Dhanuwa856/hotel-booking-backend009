import express from "express";
import {
  checkAdmin,
  checkCustomer,
  checkEmailVerified,
  checkLoggedIn,
  verifyUserStatus,
} from "../Controllers/userController.js";
import {
  cancelBooking,
  createBooking,
  createBookingUsingCategory,
  getAllBookings,
  getBookingsByEmail,
  updateBooking,
} from "../Controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post(
  "/",
  checkLoggedIn,
  checkCustomer,
  verifyUserStatus,
  checkEmailVerified,
  createBooking
);
bookingRouter.get("/", checkLoggedIn, checkCustomer, getBookingsByEmail);
bookingRouter.get("/all", checkLoggedIn, checkAdmin, getAllBookings); // correct code
bookingRouter.put(
  "/cancel/:bookingId/",
  checkLoggedIn,
  checkCustomer,
  verifyUserStatus,
  checkEmailVerified,
  cancelBooking
);
bookingRouter.put(
  "/change/:booking_id/",
  checkLoggedIn,
  checkAdmin,
  updateBooking
);
bookingRouter.post(
  "/quick-booking",
  checkLoggedIn,
  checkCustomer,
  verifyUserStatus,
  checkEmailVerified,
  createBookingUsingCategory
);

export default bookingRouter;
