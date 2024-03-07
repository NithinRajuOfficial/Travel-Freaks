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
exports.messageController = void 0;
const chatSchema_1 = require("../models/chatSchema");
const messageSchema_1 = require("../models/messageSchema");
const userSchema_1 = require("../models/userSchema");
exports.messageController = {
    sendMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { content, chatId } = req.body;
            if (!content || !chatId) {
                console.error("Content or chatId is missing in sending message");
                return res
                    .status(400)
                    .json({ message: "Content or chatId is missing" });
            }
            const newMessage = {
                sender: (_a = req.payload) === null || _a === void 0 ? void 0 : _a.userId,
                content,
                chatId,
            };
            // Create a new message
            let message = yield messageSchema_1.Message.create(newMessage);
            // Populate the 'sender' field of the message
            message = yield message
                .populate("sender", "name profileImage");
            message = yield message.populate("chat");
            message = yield userSchema_1.User.populate(message, {
                path: "chat.users",
                select: "name profileImage email",
            });
            yield chatSchema_1.Chat.findByIdAndUpdate(chatId, { latestMessage: message });
            // Send the populated message in the response
            res.status(200).json({ message });
        }
        catch (error) {
            console.error("Failed to send message ERROR:", error);
            res.status(500).json({ message: "Server ERROR" });
        }
    }),
};
