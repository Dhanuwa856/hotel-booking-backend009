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
    const rooms = await Room.find();
    res.status(200).json(rooms);
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
