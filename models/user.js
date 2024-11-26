import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "customer",
  },
  whatsApp: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationToken: [
    {
      type: Number,
      required: false, // Not required by default
    },
  ],
  verificationTokenExpires: {
    type: Date,
    required: false, // Not required by default
  },
});

const User = mongoose.model("User009", userSchema);

export default User;
