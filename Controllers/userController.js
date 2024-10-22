import argon2 from "argon2";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Create User

export async function createUser(req, res) {
  const user = req.body;
  const password = req.body.password;

  try {
    const passwordHash = await argon2.hash(password);
    user.password = passwordHash;
    const newUser = await new User(user).save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all users
export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// User login function
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Verify the password with Argon2
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Prepare JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      disabled: user.disabled,
      type: user.type,
      emailVerified: user.emailVerified,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "48h" });

    // Respond with user data and token
    res.json({
      message: "User authenticated successfully",
      user,
      token,
    });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ message: "Server error while logging in" });
  }
}

// Middleware to check if the user is logged in
export const checkLoggedIn = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      message: "Please Login",
    });
  }

  next(); // Proceed to the next middleware or controller function
};

// Middleware to check if the user is an admin
export const checkAdmin = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      message: "Please Login",
    });
  }

  if (user?.type !== "admin") {
    return res.status(403).json({
      message: "You do not have permission to perform this action",
    });
  }

  next(); // Proceed if the user is an admin
};
// Middleware to check if the user is an customer
export const checkCustomer = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      message: "Please Login",
    });
  }

  if (user?.type !== "customer") {
    return res.status(403).json({
      message: "You do not have permission to perform this action",
    });
  }

  next(); // Proceed if the user is an customer
};

export const blockUser = async (req, res) => {
  const { email } = req.params; // Get user email from request parameters

  try {
    // Find the user by email
    const userToBlock = await User.findOne({ email });

    // Check if the user exists
    if (!userToBlock) {
      return res
        .status(404)
        .json({ message: `User with email '${email}' not found.` });
    }

    // Update the user's disabled status to true
    userToBlock.disabled = true;
    await userToBlock.save();

    res.status(200).json({
      message: `User with email '${email}' has been blocked successfully.`,
      user: userToBlock,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to block user",
      error: error.message,
    });
  }
};

export const checkEmailVerified = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      message: "Please Login",
    });
  }

  // Check if the user's email is verified
  if (!user.emailVerified) {
    return res.status(403).json({
      message:
        "Your email is not verified. Please verify your email to proceed.",
    });
  }

  next(); // Proceed if the user's email is verified
};
