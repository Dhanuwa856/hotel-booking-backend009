import Booking from "../models/booking.js";
import Room from "../models/room.js";

export const createBooking = async (req, res) => {
  const user = req.user;

  // Ensure the user is logged in
  if (!user) {
    return res.status(403).json({ message: "Please Login" });
  }

  const { room_id, checkInDate, checkOutDate, guests, reason, notes } =
    req.body;

  try {
    // Validate if the room exists
    const room = await Room.findOne({ roomNumber: room_id });
    if (!room) {
      return res.status(404).json({ message: `Room '${room_id}' not found` });
    }

    // Check if the room is already booked for the specified dates
    const existingBooking = await Booking.findOne({
      room_id,
      $or: [
        {
          checkInDate: { $lte: checkOutDate, $gte: checkInDate }, // Overlap check
        },
        {
          checkOutDate: { $gte: checkInDate, $lte: checkOutDate }, // Overlap check
        },
      ],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Room is already booked for the selected dates." });
    }

    // Generate unique booking_id starting from 2003
    const lastBooking = await Booking.findOne().sort({ booking_id: -1 });
    const booking_id = lastBooking ? lastBooking.booking_id + 1 : 2003;

    // Create new booking
    const newBooking = new Booking({
      booking_id,
      room_id,
      email: user.email, // Automatically assign the logged-in user's email
      checkInDate,
      checkOutDate,
      guests,
      reason,
      notes,
    });

    // Save the new booking
    await newBooking.save();

    // Respond with success
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error); // Log error for debugging
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};
