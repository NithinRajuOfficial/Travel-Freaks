"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Following = exports.Followers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const followerSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    followerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
});
const followingSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    followingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
});
exports.Followers = mongoose_1.default.model("Follower", followerSchema);
exports.Following = mongoose_1.default.model("Following", followingSchema);
