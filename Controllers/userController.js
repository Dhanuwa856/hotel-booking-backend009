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
      type: user.type,
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
