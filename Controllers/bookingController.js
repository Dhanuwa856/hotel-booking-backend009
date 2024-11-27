import Booking from "../models/booking.js";
import Room from "../models/room.js";

export const createBooking = async (req, res) => {
  const user = req.user;

  // Check if the user is disabled
  if (user.disabled) {
    return res.status(403).json({
      message: "Your account has been disabled. You cannot make bookings.",
    });
  }

  const { room_id, checkInDate, checkOutDate, guests, reason, notes } =
    req.body;

  if (checkInDate >= checkOutDate) {
    return res
      .status(400)
      .json({ message: "Check-out date must be after check-in date." });
  }

  try {
    // Validate if room exists
    const room = await Room.findOne({ roomNumber: room_id });
    if (!room) {
      return res.status(404).json({ message: `Room '${room_id}' not found.` });
    }

    // Check if the room is available
    if (!room.isAvailable) {
      return res.status(400).json({
        message:
          "This room is currently unavailable. Please choose a different room.",
      });
    }

    // Check for existing bookings with the same room that are not cancelled
    const existingBooking = await Booking.findOne({
      room_id,
      status: { $ne: "cancelled" },
      $or: [
        {
          checkInDate: { $gte: checkInDate, $lt: checkOutDate },
        },
        {
          checkOutDate: { $gt: checkInDate, $lte: checkOutDate },
        },
        {
          checkInDate: { $gte: checkInDate, $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate, $lte: checkOutDate },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "This room is already booked during the selected dates. Please choose different dates or another room.",
      });
    }

    // Generate unique booking_id
    const lastBooking = await Booking.findOne().sort({ booking_id: -1 });
    const booking_id = lastBooking ? lastBooking.booking_id + 1 : 2003;

    // Create new booking
    const newBooking = new Booking({
      booking_id,
      room_id,
      email: user.email,
      phone: user.phone,
      checkInDate,
      checkOutDate,
      guests,
      reason,
      notes,
      status: "pending",
    });

    // Save the booking
    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking. Please try again later.",
      error: error.message,
    });
  }
};

export const getBookingsByEmail = async (req, res) => {
  const user = req.user;

  // Extract query parameters
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default to 10 items per page
  const status = req.query.status || null; // Optional status filter

  try {
    // Build the query object
    const query = { email: user.email };
    if (status) {
      query.status = status; // Add status filter if provided
    }

    // Count the total number of bookings matching the query
    const totalBookings = await Booking.countDocuments(query);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalBookings / pageSize);

    // Fetch paginated bookings, sorted by timeStamp in descending order
    const bookings = await Booking.find(query)
      .sort({ timeStamp: -1 }) // Sort by timeStamp in descending order
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Check if bookings exist
    if (bookings.length === 0) {
      return res.status(404).json({
        message: "No bookings found for the given criteria.",
      });
    }

    // Respond with the bookings and pagination metadata
    res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings,
      pagination: {
        totalBookings,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error); // Log error for debugging
    res.status(500).json({
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    // Retrieve all bookings from the database
    const bookings = await Booking.find();

    // Send the bookings as a response
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve bookings", error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  const user = req.user;
  const { bookingId } = req.params; // Get booking ID from URL

  try {
    // Find the booking by ID
    const booking = await Booking.findOne({ booking_id: bookingId });

    // Check if the booking exists
    if (!booking) {
      return res
        .status(404)
        .json({ message: `Booking ID '${bookingId}' not found` });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.email !== user.email) {
      return res
        .status(403)
        .json({ message: "You do not have permission to cancel this booking" });
    }

    // Update the booking status to "cancelled"
    booking.status = "cancelled"; // Set status to cancelled
    await booking.save(); // Save the updated booking

    res.status(200).json({
      message: `Booking ID '${bookingId}' has been cancelled successfully`,
      booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to cancel booking", error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  const { booking_id } = req.params; // Get booking_id from the request parameters
  const updatedData = req.body; // Get the data to update from the request body

  try {
    // Find the booking by booking_id
    const booking = await Booking.findOne({ booking_id });

    // Check if the booking exists
    if (!booking) {
      return res
        .status(404)
        .json({ message: `Booking with ID '${booking_id}' not found.` });
    }

    // Update the booking details
    const updatedBooking = await Booking.findOneAndUpdate(
      { booking_id },
      updatedData,
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

export const createBookingUsingCategory = async (req, res) => {
  try {
    const start = new Date(req.body.checkInDate);
    const end = new Date(req.body.checkOutDate);
    const category = req.body.category;
    const guests = req.body.guests;
    const email = req.user?.email; // Use optional chaining to avoid crashes
    const phone = req.user?.phone;

    // Validate required fields
    if (!start || !end || !category || !guests) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "Check-out date must be after check-in date." });
    }

    // Step 1: Find bookings that overlap with the specified date range
    const overlappingBookings = await Booking.find({
      status: { $in: ["confirmed", "pending"] }, // Include both confirmed and pending bookings
      $or: [
        { checkInDate: { $gte: start, $lt: end } },
        { checkOutDate: { $gt: start, $lte: end } },
      ],
    });

    // Step 2: Extract room IDs of booked rooms from the overlapping bookings
    const bookedRoomIds = overlappingBookings.map((booking) => booking.room_id);

    // Step 3: Query rooms that are not in the bookedRoomIds and match the category
    const availableRooms = await Room.find({
      roomNumber: { $nin: bookedRoomIds },
      category: category,
    });

    // Step 4: Handle available rooms
    if (availableRooms.length > 0) {
      const selectedRoom = availableRooms[0]; // Select the top available room

      // Generate unique booking_id
      const lastBooking = await Booking.findOne().sort({ booking_id: -1 });
      const booking_id = lastBooking ? lastBooking.booking_id + 1 : 2003;

      // Create a new booking with the selected room
      const newBooking = await Booking.create({
        booking_id,
        room_id: selectedRoom.roomNumber,
        checkInDate: start,
        checkOutDate: end,
        guests: guests,
        email: email,
        phone: phone,
        timeStamp: new Date(),
      });

      return res.status(200).json({
        message: "Booking created successfully with the available room.",
        data: newBooking,
      });
    } else {
      // No available rooms found
      return res.status(404).json({
        message: "No rooms available for the selected dates and criteria.",
      });
    }
  } catch (error) {
    console.error("Error in creating booking using category:", error);
    return res.status(500).json({
      message: "An error occurred while searching for available rooms.",
      error: error.message,
    });
  }
};
