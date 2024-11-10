import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
  feedback_id: {
    type: Number,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("feedback009", feedbackSchema);
export default Feedback;
