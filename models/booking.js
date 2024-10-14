import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: Number,
    required: true,
    unique: true, // Ensures the booking ID is unique
  },
  room_id: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "pending", "cancelled"],
    default: "pending",
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  timeStamp: {
    type: Date,
    default: Date.now, // Automatically set the time of booking creation
  },
});

const Booking = mongoose.model("Booking009", bookingSchema);

export default Booking;
