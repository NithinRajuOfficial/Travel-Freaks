import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
});

export const User = mongoose.model("User", userSchema);
