import argon2 from "argon2";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Booking from "../models/booking.js";
import { sendEmail } from "./emailService.js";

// Create User
// export async function createUser(req, res) {
//   const user = req.body;
//   const password = req.body.password;

//   try {
//     const passwordHash = await argon2.hash(password);
//     user.password = passwordHash;

//     // Generate a 6-digit verification token
//     const verificationToken = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     // Set the token expiration to 10 minutes from now
//     const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds

//     // Add verification fields to the user object
//     user.verificationToken = verificationToken;
//     user.verificationTokenExpires = verificationTokenExpires;

//     const newUser = await new User(user).save();
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// }

export async function createUser(req, res) {
  const user = req.body;
  const password = req.body.password;

  try {
    // Hash the password
    const passwordHash = await argon2.hash(password);
    user.password = passwordHash;

    // Generate a 6-digit verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Set the token expiration to 60 minutes from now
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes in milliseconds

    // Add verification fields to the user object
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;

    // Save the user to the database
    const newUser = await new User(user).save();

    // Send the OTP via email
    await sendEmail(
      newUser.email,
      "Email Verification - Hotel Name",
      `Hi ${newUser.firstName},\n\nThank you for signing up! Please verify your email address to activate your account.\n\nYour OTP (One-Time Password) is: ${verificationToken}\n\nThis OTP is valid for 60 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nHotel Name Team`
    );

    // Send a response (omit sensitive information like password)
    res.status(201).json({
      message: "User created successfully! Please verify your email.",
      user: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        type: newUser.type,
        emailVerified: newUser.emailVerified,
      },
    });
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
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      disabled: user.disabled,
      type: user.type,
      emailVerified: user.emailVerified,
      image: user.image,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_KEY);

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

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    const confirmedPercentage = (
      (confirmedBookings / totalBookings) *
      100
    ).toFixed(2);
    const pendingPercentage = ((pendingBookings / totalBookings) * 100).toFixed(
      2
    );

    res.status(200).json({
      totalUsers,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      confirmedPercentage,
      pendingPercentage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Customer Info change

export const updateUser = async (req, res) => {
  const userEmail = req.params.userEmail;
  const updatedData = req.body;

  try {
    const updatedUserInfo = await User.findOneAndUpdate(
      { email: userEmail },
      updatedData,
      { new: true }
    );
    // check if the email was found
    if (!updatedUserInfo) {
      return res.status(404).json({ message: `${userEmail} Not Found` });
    }
    res.status(200).json({ message: "User Info Updated Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update user info", error: err.message });
  }
};

export const verifyUserStatus = async (req, res, next) => {
  const user = req.user; // Assuming `req.user` is set with the user from the token.
  const userEmail = user.email;

  try {
    // Fetch the latest user data from the database using the email
    const userStatus = await User.findOne({ email: userEmail });

    // If the user is not found, return an error
    if (!userStatus) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // If the user is disabled, block the action
    if (userStatus.disabled) {
      return res.status(403).json({
        message: "Your account has been disabled. You cannot make bookings.",
      });
    }

    // User is active, continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify user status",
      error: error.message,
    });
  }
};

export async function verifyEmail(req, res) {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Mark the email as verified
    user.emailVerified = true;
    user.verificationToken = null; // Clear token
    user.verificationTokenExpires = null; // Clear expiry
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
