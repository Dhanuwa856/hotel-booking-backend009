import express from "express";
import { checkCustomer, checkLoggedIn } from "../Controllers/userController.js";
import { createBooking } from "../Controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", checkLoggedIn, checkCustomer, createBooking);

export default bookingRouter;
