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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = require("../models/userSchema");
const postSchema_1 = require("../models/postSchema");
const followRelationshipSchema_1 = require("../models/followRelationshipSchema");
exports.userController = {
    // adding post
    addPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            console.log(req.body);
            // Retrieve userId from the custom response header
            const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.userId;
            // extracting file from the request header
            const file = req.uploadedFile;
            // Extracting post data from the request
            const { title, description, startDate, endDate, location, itinerary, amount, currency, maxNoOfPeoples, } = req.body;
            // Creating a new post
            const newPost = new postSchema_1.Post({
                userId: userId,
                title: title,
                description: description,
                image: file,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                location: location,
                itinerary: JSON.parse(itinerary),
                budget: { amount, currency },
                maxNoOfPeoples: maxNoOfPeoples,
            });
            // Save the new post
            yield newPost.save();
            // Sending back the response
            res
                .status(201)
                .json({ message: "Post added successfully", post: newPost });
        }
        catch (error) {
            console.error("Add Post error:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // updating post details
    updatePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        try {
            const file = req.uploadedFile;
            const postId = req.params.postId;
            const itineraryObj = JSON.parse(req.body.itinerary);
            const matchedPost = yield postSchema_1.Post.findById(postId);
            if (!matchedPost) {
                return res
                    .status(400)
                    .json({ error: "No Post found on the id provided" });
            }
            if (req.body.title !== matchedPost.title) {
                matchedPost.title = req.body.title;
            }
            if (req.body.description !== matchedPost.description) {
                matchedPost.description = req.body.description;
            }
            if (req.body.startDate !== matchedPost.startDate) {
                matchedPost.startDate = new Date(req.body.startDate);
            }
            if (req.body.endDate !== matchedPost.startDate) {
                matchedPost.endDate = new Date(req.body.endDate);
            }
            if (req.body.location !== matchedPost.location) {
                matchedPost.location = req.body.location;
            }
            if (itineraryObj && Array.isArray(itineraryObj)) {
                matchedPost.itinerary = itineraryObj;
            }
            if (req.body.currency !== ((_b = matchedPost.budget) === null || _b === void 0 ? void 0 : _b.currency) ||
                req.body.amount !== ((_c = matchedPost.budget) === null || _c === void 0 ? void 0 : _c.amount)) {
                matchedPost.budget = {
                    currency: req.body.currency,
                    amount: req.body.amount,
                };
            }
            if (req.body.maxNoOfPeoples !== matchedPost.maxNoOfPeoples) {
                matchedPost.maxNoOfPeoples = req.body.maxNoOfPeoples;
            }
            if (file) {
                matchedPost.image = file && file;
            }
            yield matchedPost.save();
            res
                .status(201)
                .json({ message: "Successfully edited the post", post: matchedPost });
        }
        catch (error) {
            console.error("Update Post error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    // getting all posts from database
    getAllPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // fetching all posts from database
            const posts = yield postSchema_1.Post.find().sort({ _id: -1 });
            res
                .status(201)
                .json({ message: "Successfully got all posts", allPosts: posts });
        }
        catch (error) {
            console.error("Unable to fetch all Posts:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // getting user details
    getUserDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        try {
            // Retrieve userId from the custom response header
            // const userId = res.get("X-UserId");
            let userId;
            if (req.params.userId) {
                userId = req.params.userId;
            }
            else {
                userId = (_d = req.payload) === null || _d === void 0 ? void 0 : _d.userId;
            }
            // retrieving data of that particular user from the database
            const userDetails = yield userSchema_1.User.findById(userId);
            // condition to handle error case in the getting the userDetails
            if (!userDetails) {
                res.status(400).json({ error: "Failed to get the user details" });
            }
            // Check if the user identified by req.payload.userId follows the user identified by req.params.userId
            const followingDocument = yield followRelationshipSchema_1.Following.findOne({
                userId: (_e = req.payload) === null || _e === void 0 ? void 0 : _e.userId,
                followingId: userId,
            });
            const isFollowing = !!followingDocument; // Convert to a boolean indicating whether the following relationship exists
            res.status(201).json({
                message: "Successfully got the details of the user",
                userDetails: userDetails,
                isFollowing: isFollowing,
            });
        }
        catch (error) {
            console.error("Unable to fetch user details:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // Updating user details
    updateUserDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        try {
            // Retrieve userId from the custom response header
            const userId = (_f = req.payload) === null || _f === void 0 ? void 0 : _f.userId;
            const file = req.uploadedFile;
            //matching the user id with db to get the specific user
            const user = yield userSchema_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if ((user === null || user === void 0 ? void 0 : user.name) !== req.body.name) {
                user.name = req.body.name;
            }
            if ((user === null || user === void 0 ? void 0 : user.bio) !== req.body.bio) {
                user.bio = req.body.bio.trim();
            }
            if ((user === null || user === void 0 ? void 0 : user.email) !== req.body.email) {
                user.email = req.body.email;
            }
            if (file) {
                user.profileImage = file && file;
            }
            //now matching the old password entered with the password in the db
            if (req.body.oldPassword) {
                const isPasswordMatch = yield bcrypt_1.default.compare(req.body.oldPassword, user.password);
                if (isPasswordMatch) {
                    const saltRounds = 10;
                    const newPasswordHashed = yield bcrypt_1.default.hash(req.body.newPassword, saltRounds);
                    user.password = newPasswordHashed;
                }
                if (!isPasswordMatch) {
                    return res
                        .status(400)
                        .json({ error: "Entered Password doesn't match" });
                }
            }
            yield (user === null || user === void 0 ? void 0 : user.save());
            return res
                .status(201)
                .json({ message: "Successfully updated user data", user });
        }
        catch (error) {
            console.error("Unable to update user details:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    // getting all users from the db
    getAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _g;
        try {
            const loggedInUserId = (_g = req.payload) === null || _g === void 0 ? void 0 : _g.userId;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize);
            2;
            const skip = (page - 1) * pageSize;
            const followingIds = yield followRelationshipSchema_1.Following.find({
                userId: loggedInUserId,
            }).distinct("followingId");
            const allUsersData = yield userSchema_1.User.find({
                _id: { $nin: [...followingIds, loggedInUserId] },
            })
                .skip(skip)
                .limit(pageSize)
                .exec();
            const filteredUsersData = allUsersData.filter((user) => user._id.toString() !== loggedInUserId);
            console.log(filteredUsersData);
            console.log(filteredUsersData, "filteredUsersData");
            res.status(201).json({
                message: "Successfully got all user data:",
                allUsersData: filteredUsersData,
            });
            if (!allUsersData) {
                res.status(400).json({ error: "Unable to get all users" });
            }
        }
        catch (error) {
            console.error("Unable to get all users:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    // getting post details
    getPostDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("mmm");
            const postId = req.query.postId;
            const postDetails = yield postSchema_1.Post.findById(postId).populate({
                path: "userId",
                select: "_id name profileImage",
            });
            if (!postDetails) {
                return res
                    .status(401)
                    .json({ error: "Unable to find the post details" });
            }
            return res
                .status(201)
                .json({ message: "Successfully got the post details", postDetails });
        }
        catch (error) {
            console.error("Unable to find the post details:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // Route for adding or updating the user cover img
    addOrUpdateUserCoverImg: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _h;
        try {
            const userId = (_h = req.payload) === null || _h === void 0 ? void 0 : _h.userId;
            const file = req.uploadedFile;
            const user = yield userSchema_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            user.coverImg = file && file;
            yield (user === null || user === void 0 ? void 0 : user.save());
            return res
                .status(202)
                .json({ message: "Successfully updated user data", user });
        }
        catch (error) {
            console.error("Unable to add or update the cover image:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    // to add a specific user to the following list
    addToFollowing: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _j;
        try {
            const idOfTheUserToBeFollowed = req.query.userIdToFollow;
            const userId = (_j = req.payload) === null || _j === void 0 ? void 0 : _j.userId;
            // Checking id the user is already following the targeted user
            const existingFollowing = yield followRelationshipSchema_1.Following.findOne({
                userId,
                followingId: idOfTheUserToBeFollowed,
            });
            if (existingFollowing) {
                // deleting entry from the following collection
                yield followRelationshipSchema_1.Following.deleteOne({
                    userId,
                    followingId: idOfTheUserToBeFollowed,
                });
                // delete corresponding entry from the followers collection
                // await Followers.deleteOne({
                //   userId: idOfTheUserToBeFollowed,
                //   followerId: userId,
                // });
                return res.status(200).json({
                    message: "User unfollowed successfully",
                    isFollowing: false,
                    toUnfollow: true,
                });
            }
            // creating a new entry for the following collection
            const followingEntry = new followRelationshipSchema_1.Following({
                userId,
                followingId: idOfTheUserToBeFollowed,
            });
            // save the following entry
            yield followingEntry.save();
            // return success message
            return res.status(200).json({
                message: "User followed successfully",
                isFollowing: true,
                toUnfollow: false,
            });
        }
        catch (error) {
            console.error("Error occurred on following this user:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // to get the following list of the user
    getFollowingList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _k;
        try {
            const userId = (_k = req.payload) === null || _k === void 0 ? void 0 : _k.userId;
            const followingList = yield followRelationshipSchema_1.Following.find({ userId: userId }).populate("followingId");
            res.status(200).json({
                message: "Successfully got users following list",
                followingList,
            });
        }
        catch (error) {
            console.error("Error occurred while fetching users following list:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // to get the followers list of the user
    getFollowersList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _l;
        try {
            const userId = (_l = req.payload) === null || _l === void 0 ? void 0 : _l.userId;
            const followersList = yield followRelationshipSchema_1.Following.find({
                followingId: userId,
            }).populate({ path: "userId", select: "name profileImage" });
            const followingList = yield followRelationshipSchema_1.Following.find({ userId: userId }).populate({
                path: "followingId",
                select: "name profileImage",
            });
            let obj = [];
            followersList.forEach((follower) => {
                const isFollowing = followingList.some((following) => { var _a; return (_a = following.followingId) === null || _a === void 0 ? void 0 : _a.equals(follower === null || follower === void 0 ? void 0 : follower.userId._id); });
                obj.push({ data: follower.userId, isFollowing });
            });
            res.status(200).json({
                message: "Successfully got users followers list",
                obj,
            });
        }
        catch (error) {
            console.error("Error occurred while fetching users followers list:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // Route to delete a post
    deletePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postId = req.params.postId;
            const deletedPost = yield postSchema_1.Post.deleteOne({ postId });
            console.log(deletedPost, "pp");
            res.status(200).json({ message: "Post successfully deleted" });
        }
        catch (error) {
            console.error("Error occurred while deleting the post:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // function to like or unlike a post
    likeOrUnlike: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _m;
        try {
            const postId = req.params.postId;
            const userId = (_m = req.payload) === null || _m === void 0 ? void 0 : _m.userId;
            let currentLikeStatus = false;
            console.log(userId, "ppp");
            if (!userId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const post = yield postSchema_1.Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            // Ensure userId is a non-null string before converting to ObjectId
            if (typeof userId === "string") {
                const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
                // Check if the user has already liked the post
                const likedIndex = post.likes.findIndex((like) => like.equals(userIdObject));
                if (likedIndex !== -1) {
                    // If the user has already liked the post, remove the like
                    post.likes = post.likes.filter((like, index) => index !== likedIndex);
                }
                else {
                    // If the user hasn't liked the post, add the like
                    post.likes.push(userIdObject);
                    currentLikeStatus = true;
                }
            }
            // Save the changes to the post
            yield post.save();
            const numberOfLikes = post.likes.length;
            res.status(200).json({
                message: "Like/Unlike action successful",
                currentLikeStatus,
                numberOfLikes,
            });
        }
        catch (error) {
            console.error("Error occurred while like or unlike action:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
};
