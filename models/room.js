import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ["Standard", "Deluxe", "Luxury"],
    required: true,
  },
  maxGuests: { type: Number, required: true },
  photos: [{ type: String }], // Array of image URLs
  description: { type: String }, // Special room description
  isAvailable: { type: Boolean, default: true }, // For maintenance
  price: { type: Number, required: true }, // Room price based on category
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room009", roomSchema);
export default Room;
