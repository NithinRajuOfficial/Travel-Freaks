"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model("User", userSchema);
