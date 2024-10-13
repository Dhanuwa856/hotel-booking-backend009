import Room from "../models/room.js";

// Create a new room (Admin only)
export const createRoom = async (req, res) => {
  const user = req.user;
  // Check if the user is logged in
  if (!user) {
    return res.status(403).json({ message: "Please Login" });
  }
  // Check if the user is an admin
  if (user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "You do not have permission to create a room" });
  }
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
