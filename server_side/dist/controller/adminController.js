"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const userSchema_1 = require("../models/userSchema");
const postSchema_1 = require("../models/postSchema");
const commentSchema_1 = require("../models/commentSchema");
const analyticsData_1 = require("../models/analyticsData");
exports.adminController = {
    // Function for getting the analytics data
    collectDailyAnalyticsData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            // Check if an analytics document already exists for today
            // let existingAnalyticsData = await AnalyticsData.findOne({ date: { $gte: startOfDay, $lt: endOfDay } });
            let existingAnalyticsData = yield analyticsData_1.AnalyticsData.findOne({
                date: {
                    $gte: startOfDay,
                    $lt: endOfDay, // Less than the end of the day
                },
            });
            console.log(existingAnalyticsData, "pp");
            if (!existingAnalyticsData) {
                // If no existing document is found, create a new one
                existingAnalyticsData = new analyticsData_1.AnalyticsData({
                    date: today,
                    dailyActiveUsers: 0,
                    postsCreated: 0,
                    likesReceivedForPostCreatedToday: 0,
                    commentsReceivedForPostCreatedToday: 0,
                    totalLikesReceivedToday: 0,
                    totalCommentsReceivedToday: 0,
                    totalLikesReceived: 0,
                    totalCommentsReceived: 0,
                });
            }
            // Calculating daily active users
            existingAnalyticsData.dailyActiveUsers = yield userSchema_1.User.countDocuments({
                activityType: "login",
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                },
            }); //2023-10-21T03:54:54.712+00:00
            // calculating daily post creation
            const postCreated = yield postSchema_1.Post.find({
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                },
            });
            //getting all posts
            const allPostsCreated = yield postSchema_1.Post.find();
            //  calculating likes received for the posts created today
            existingAnalyticsData.likesReceivedForPostCreatedToday =
                postCreated.reduce((totalLikes, post) => totalLikes + post.likes.length, 0);
            // calculating comments received for the posts created today
            existingAnalyticsData.commentsReceivedForPostCreatedToday = 0;
            for (const post of postCreated) {
                const comments = yield commentSchema_1.Comment.countDocuments({
                    postId: post._id,
                });
                existingAnalyticsData.commentsReceivedForPostCreatedToday += comments;
            }
            // calculating daily total likes received
            existingAnalyticsData.totalLikesReceivedToday = allPostsCreated.reduce((totalLikes, post) => totalLikes + post.likes.length, 0);
            // calculating daily total comments received
            existingAnalyticsData.totalCommentsReceivedToday = 0; // Initialize the comment count
            for (const post of allPostsCreated) {
                const comments = yield commentSchema_1.Comment.countDocuments({
                    postId: post._id,
                });
                existingAnalyticsData.totalCommentsReceivedToday += comments;
            }
            existingAnalyticsData.postsCreated = postCreated.length;
            // Calculate the total count of likes and comments for all posts
            const totalLikesReceived = yield postSchema_1.Post.aggregate([
                {
                    $group: {
                        _id: null,
                        totalLikes: {
                            $sum: { $size: "$likes" }, // Use $size to count the number of likes
                        },
                    },
                },
            ]);
            console.log(totalLikesReceived, "[[[");
            const totalCommentsReceived = yield commentSchema_1.Comment.countDocuments();
            // Update the analytics data with the total likes count
            existingAnalyticsData.totalLikesReceived =
                totalLikesReceived[0].totalLikes;
            existingAnalyticsData.totalCommentsReceived = totalCommentsReceived;
            // Save the document
            yield existingAnalyticsData.save();
            const responseData = {
                date: existingAnalyticsData.date,
                dailyActiveUsers: existingAnalyticsData.dailyActiveUsers,
                postsCreated: existingAnalyticsData.postsCreated,
                likesReceivedForPostCreatedToday: existingAnalyticsData.likesReceivedForPostCreatedToday,
                commentsReceivedForPostCreatedToday: existingAnalyticsData.commentsReceivedForPostCreatedToday,
                totalLikesReceivedToday: existingAnalyticsData.totalLikesReceivedToday,
                totalCommentsReceivedToday: existingAnalyticsData.totalCommentsReceivedToday,
                totalLikesReceived: existingAnalyticsData.totalLikesReceived,
                totalCommentsReceived: existingAnalyticsData.totalCommentsReceived,
            };
            res.status(200).json({
                message: "Successfully got all the analytics data",
                analyticsData: responseData,
            });
        }
        catch (error) {
            console.error("Unable to get the analytics data:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // function to get all the users data
    fetchAllUsersData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsersData = yield userSchema_1.User.find();
            if (!allUsersData) {
                return res
                    .status(400)
                    .json({
                    error: "Something went wrong while fetching all users data",
                });
            }
            return res
                .status(200)
                .json({
                message: "Successfully got all users data",
                allUsersData: allUsersData,
            });
        }
        catch (error) {
            console.error("Unable to get all the users data:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    // functionality to block or unblock user
    blockOrUnblockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const userData = yield userSchema_1.User.findById(userId);
            if (!userData) {
                return res.status(400).json({ error: "User data not found" });
            }
            // assigning the value to the status
            userData.blockStatus = !userData.blockStatus;
            // saving it to database
            yield userData.save();
            if (userData.blockStatus) {
                return res
                    .status(201)
                    .json({
                    message: "User Block Successful",
                    status: userData.blockStatus,
                });
            }
            else {
                return res
                    .status(201)
                    .json({
                    message: "User Unblock successful",
                    status: userData.blockStatus,
                });
            }
        }
        catch (error) {
            console.error("Unable to block or unblock user:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
};
