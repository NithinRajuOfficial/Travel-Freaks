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
exports.chatController = void 0;
const chatSchema_1 = require("../models/chatSchema"); // Import the Chat model and its interface
const userSchema_1 = require("../models/userSchema");
const followRelationshipSchema_1 = require("../models/followRelationshipSchema");
exports.chatController = {
    searchUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const loggedInUserId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.userId;
            const searchData = req.query.search;
            const followingIds = yield followRelationshipSchema_1.Following.find({
                userId: loggedInUserId,
            }).distinct("followingId");
            const user = yield userSchema_1.User.find({
                _id: { $in: followingIds },
                name: { $regex: new RegExp(searchData, "i") },
            }).select("-password -refreshTokens -createdAt -bio");
            if (user.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log(user, "match");
            res.status(200).json({ message: "User found", user });
        }
        catch (error) {
            console.error("Failed to find the searched user");
            res.status(500).json({ error: "Server error" });
        }
    }),
    accessChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        try {
            const userId = req.params.userId;
            if (!userId) {
                console.log("UserId param not sent with request");
                return res.status(400).json({ error: "no userId found" });
            }
            // Define the type for isChat
            // Mongoose query with type assertion
            let isChat = yield chatSchema_1.Chat.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: (_b = req.payload) === null || _b === void 0 ? void 0 : _b.userId } } },
                    { users: { $elemMatch: { $eq: userId } } },
                ],
            })
                .populate("users", "-password")
                .populate("latestMessage")
                .lean(); // Use lean() to return plain JavaScript objects instead of Mongoose documents
            // Populate users for latestMessage (if needed)
            isChat = yield Promise.all(isChat.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
                chat.latestMessage = (yield userSchema_1.User.populate(chat.latestMessage, {
                    path: "sender",
                    select: "name pic email",
                }));
                return chat;
            })));
            if (isChat.length > 0) {
                res.send(isChat[0]);
            }
            else {
                var chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [(_c = req.payload) === null || _c === void 0 ? void 0 : _c.userId, userId],
                };
                const createdChat = yield chatSchema_1.Chat.create(chatData);
                const FullChat = yield chatSchema_1.Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
                res.status(200).json(FullChat);
            }
        }
        catch (error) {
            console.error("accessChat error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    fetchChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        try {
            const results = yield chatSchema_1.Chat.find({
                users: { $elemMatch: { $eq: (_d = req.payload) === null || _d === void 0 ? void 0 : _d.userId } },
            })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")
                .sort({ updatedAt: -1 });
            const populatedResults = yield userSchema_1.User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(populatedResults);
        }
        catch (error) {
            console.error("fetchChats error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    createGroupChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.body.users || !req.body.name) {
                return res.status(400).send({ message: "Please Fill all the feilds" });
            }
            var users = JSON.parse(req.body.users);
            if (users.length < 2) {
                return res
                    .status(400)
                    .send("More than 2 users are required to form a group chat");
            }
            //   users.push(req.user);
            const groupChat = yield chatSchema_1.Chat.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                // groupAdmin: req.user,
            });
            const fullGroupChat = yield chatSchema_1.Chat.findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            res.status(200).json(fullGroupChat);
        }
        catch (error) {
            console.error("createGroupChat error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    renameGroup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatId, chatName } = req.body;
            const updatedChat = yield chatSchema_1.Chat.findByIdAndUpdate(chatId, {
                chatName: chatName,
            }, {
                new: true,
            })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            if (!updatedChat) {
                res.status(404);
                throw new Error("Chat Not Found");
            }
            else {
                res.json(updatedChat);
            }
        }
        catch (error) {
            console.error("renameGroup error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    removeFromGroup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatId, userId } = req.body;
            // check if the requester is admin
            const removed = yield chatSchema_1.Chat.findByIdAndUpdate(chatId, {
                $pull: { users: userId },
            }, {
                new: true,
            })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            if (!removed) {
                res.status(404);
                throw new Error("Chat Not Found");
            }
            else {
                res.json(removed);
            }
        }
        catch (error) {
            console.error("removeFromGroup error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
    addToGroup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatId, userId } = req.body;
            // check if the requester is admin
            const added = yield chatSchema_1.Chat.findByIdAndUpdate(chatId, {
                $push: { users: userId },
            }, {
                new: true,
            })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            if (!added) {
                res.status(404);
                throw new Error("Chat Not Found");
            }
            else {
                res.json(added);
            }
        }
        catch (error) {
            console.error("addToGroup error:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
};
