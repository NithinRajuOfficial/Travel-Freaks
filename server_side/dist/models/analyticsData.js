"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const analyticsDataSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    dailyActiveUsers: Number,
    postsCreated: Number,
    likesReceivedForPostCreatedToday: Number,
    commentsReceivedForPostCreatedToday: Number,
    totalLikesReceivedToday: Number,
    totalCommentsReceivedToday: Number,
    totalLikesReceived: Number,
    totalCommentsReceived: Number
});
exports.AnalyticsData = mongoose_1.default.model('AnalyticsData', analyticsDataSchema);
