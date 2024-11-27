import Room from "../models/room.js";

// Create a new room (Admin only)
export const createRoom = async (req, res) => {
  const newRoom = new Room(req.body);
  newRoom
    .save()
    .then((result) => {
      res.json({
        message: "Room create successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.json({
        message: "Failed to create room",
        error: err,
      });
    });
};

// Get all rooms (Public access)
export const getAllRooms = async (req, res) => {
  try {
    // Get page and pageSize from query parameters with default values
    const { page = 1, pageSize = 6 } = req.query;

    // Ensure page and pageSize are numbers
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedPageSize = Math.max(1, parseInt(pageSize, 10));

    // Calculate the number of documents to skip
    const skip = (parsedPage - 1) * parsedPageSize;

    // Fetch paginated rooms and total count
    const rooms = await Room.find().skip(skip).limit(parsedPageSize);

    const totalRooms = await Room.countDocuments();
    const totalPages = Math.ceil(totalRooms / parsedPageSize);

    // Return the paginated data and metadata
    res.status(200).json({
      rooms,
      totalRooms,
      totalPages,
      currentPage: parsedPage,
      pageSize: parsedPageSize,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch rooms", error: err.message });
  }
};

// Get room by room number (Public access)
export const getRoomByNumber = async (req, res) => {
  const roomNumber = req.params.roomNumber;

  try {
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res
        .status(404)
        .json({ message: `Room '${roomNumber}' not found` });
    }
    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch room details", error: error.message });
  }
};

// Update room (Admin only)
export const updateRoom = async (req, res) => {
  const { roomNumber } = req.params;
  const updatedData = req.body;

  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber },
      updatedData,
      { new: true }
    );

    // Check if the room was found
    if (!updatedRoom) {
      return res
        .status(404)
        .json({ message: `Room '${roomNumber}' not found` });
    }

    res
      .status(200)
      .json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update room", error: error.message });
  }
};
// delete room (Admin only)
export const deleteRoom = async (req, res) => {
  const { roomNumber } = req.params;

  try {
    const deletedRoom = await Room.findOneAndDelete({ roomNumber });

    // Check if the room was found and deleted
    if (!deletedRoom) {
      return res
        .status(404)
        .json({ message: `Room '${roomNumber}' not found` });
    }

    res
      .status(200)
      .json({ message: `Room '${roomNumber}' deleted successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete room", error: error.message });
  }
};
