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
exports.commentController = void 0;
const commentSchema_1 = require("../models/commentSchema");
const userSchema_1 = require("../models/userSchema");
const postSchema_1 = require("../models/postSchema");
exports.commentController = {
    // Adding comment
    addComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, postId, comment } = req.body;
            if (!comment || comment.trim() === "") {
                return res.status(400).json({ error: "Comment cant be empty" });
            }
            const existingUser = yield userSchema_1.User.findById(userId);
            const existingPost = yield postSchema_1.Post.findById(postId);
            const commentText = comment.trim();
            if (!existingUser || !existingPost) {
                return res.status(404).json({ error: "User or Post is not found" });
            }
            const commentData = new commentSchema_1.Comment({
                userId,
                postId,
                commentText,
            });
            yield commentData.save();
            return res.status(201).json({ message: "Comment added successfully", commentText });
        }
        catch (error) {
            console.error("Add Comment Error:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // getting comments
    getComments: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postId = req.params.postId;
            const { skip, limit } = req.query;
            const skipValue = typeof skip === 'string' ? parseInt(skip) : 0;
            const limitValue = typeof limit === 'string' ? parseInt(limit) : 0;
            const totalNoOfComments = (yield commentSchema_1.Comment.find({ postId }).count());
            const allComments = yield commentSchema_1.Comment.find({ postId }).populate({
                path: 'userId', select: '_id name   profileImage'
            }).skip(skipValue).limit(limitValue).sort({ createdAt: -1 });
            console.log(allComments, "ll");
            if (!allComments) {
                return res.status(404).json({ error: "Failed to get all comments with the specified Post Id" });
            }
            res.status(201).json({ message: "Successfully got all comments", allComments, totalNoOfComments });
        }
        catch (error) {
            console.error("Getting all Comments error:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }),
    // function to delete a comment 
    deleteComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const commentId = req.params.commentId;
            const deletedComment = yield commentSchema_1.Comment.deleteOne({ _id: commentId });
            console.log(deletedComment, "--==");
            res.status(200).json({ message: "Comment Successfully deleted" });
        }
        catch (error) {
            console.error("Something went wrong while deleting the comment, please try again");
            res.status(500).json({ error: "Server Error" });
        }
    }),
};
