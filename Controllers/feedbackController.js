import Feedback from "../models/feedback.js";

export const createFeedback = async (req, res) => {
  const { content, rating } = req.body;
  const user = req.user;

  try {
    // Generate unique feedback_id
    const lastFeedback = await Feedback.findOne().sort({ feedback_id: -1 });
    const feedback_id = lastFeedback ? lastFeedback.feedback_id + 1 : 1001;

    // Create new feedback with user's first and last name
    const newFeedback = new Feedback({
      feedback_id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      content,
      rating,
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit feedback", error: error.message });
  }
};

export const getFeedbackByUser = async (req, res) => {
  const user = req.user;

  try {
    const feedback = await Feedback.find({ email: user.email });
    if (!feedback) {
      return res
        .status(404)
        .json({ message: "No feedback found for this user" });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get feedback", error: error.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    if (!feedback) {
      return res.status(404).json({ message: "No feedback found" });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get feedback", error: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  const { feedback_id } = req.params;
  const { status } = req.body; // Status could be "approved" or "rejected"

  try {
    const feedback = await Feedback.findOneAndUpdate(
      { feedback_id },
      { status },
      { new: true }
    );

    if (!feedback) {
      return res
        .status(404)
        .json({ message: `Feedback '${feedback_id}' not found` });
    }

    res.status(200).json({
      message: "Feedback status updated successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update feedback status",
      error: error.message,
    });
  }
};
