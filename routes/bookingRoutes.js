import express from "express";
import { createBooking } from "../Controllers/bookingController.js";

const bookingRouter = express.Router();
bookingRouter.post("/", createBooking); // Create a new booking

export default bookingRouter;
