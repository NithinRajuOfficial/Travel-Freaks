import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  coverImg: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: [
    {
      token: {
        type: String,
        required: true,
      },
      expires: {
        type: Date,
        required: true,
      },
    },
  ],
  blockStatus: {
    type: Boolean,
    default: false,
    required: false,
  },
  otp: {
    type: String,
    required: false,
  },
  activityType: {
    type: String,
    enum: ["login", "logout"],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
