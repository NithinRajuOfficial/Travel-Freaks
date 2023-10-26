import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const followingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Followers = mongoose.model("Follower", followerSchema);
export const Following = mongoose.model("Following", followingSchema);
