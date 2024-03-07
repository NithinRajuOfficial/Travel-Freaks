import { Request, Response } from "express";
import { CustomRequest } from "../config/constants";
import { Chat } from "../models/chatSchema";
import { Message } from "../models/messageSchema";
import { User } from "../models/userSchema";

export const messageController = {
  sendMessage: async (req: CustomRequest, res: Response) => {
    try {
      const { content, chatId } = req.body;

      if (!content || !chatId) {
        console.error("Content or chatId is missing in sending message");
        return res
          .status(400)
          .json({ message: "Content or chatId is missing" });
      }

      const newMessage = {
        sender: req.payload?.userId,
        content,
        chatId,
      };

      // Create a new message
      let message: any = await Message.create(newMessage);

      // Populate the 'sender' field of the message
      message = await message
        .populate("sender", "name profileImage")

      message = await message.populate("chat")
      message = await User.populate(message, {
        path: "chat.users",
        select: "name profileImage email",
      });

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

      // Send the populated message in the response
      res.status(200).json({ message });
    } catch (error) {
      console.error("Failed to send message ERROR:", error);
      res.status(500).json({ message: "Server ERROR" });
    }
  },
};
