import { Request, Response } from "express";
import { CustomRequest } from "../config/constants";
import { Chat } from "../models/chatSchema"; // Import the Chat model and its interface
import { User } from "../models/userSchema";
import { Following } from "../models/followRelationshipSchema";

export const chatController = {
  searchUser: async (req: CustomRequest, res: Response) => {
    try {
      const loggedInUserId = req.payload?.userId;
      const searchData = req.query.search as string;

      const followingIds = await Following.find({
        userId: loggedInUserId,
      }).distinct("followingId");

      const user = await User.find({
        _id: { $in: followingIds },
        name: { $regex: new RegExp(searchData, "i") },
      }).select("-password -refreshTokens -createdAt -bio");
      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user, "match");
      res.status(200).json({ message: "User found", user });
    } catch (error) {
      console.error("Failed to find the searched user");
      res.status(500).json({ error: "Server error" });
    }
  },
  accessChat: async (req: CustomRequest, res: Response) => {
    try {
      const  userId  = req.params.userId;

      if (!userId) {
        console.log("UserId param not sent with request");
        return res.status(400).json({ error: "no userId found" });
      }

      // Define the type for isChat

      // Mongoose query with type assertion
      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.payload?.userId } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage")
        .lean(); // Use lean() to return plain JavaScript objects instead of Mongoose documents

      // Populate users for latestMessage (if needed)
      isChat = await Promise.all(
        isChat.map(async (chat) => {
          chat.latestMessage = (await User.populate(chat.latestMessage, {
            path: "sender",
            select: "name pic email",
          })) as unknown as undefined;
          return chat;
        })
      );

      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.payload?.userId, userId],
        };

        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      }
    } catch (error) {
      console.error("accessChat error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  fetchChats: async (req: CustomRequest, res: Response) => {
    try {
      const results = await Chat.find({
        users: { $elemMatch: { $eq: req.payload?.userId } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      const populatedResults = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });

      res.status(200).send(populatedResults);
    } catch (error) {
      console.error("fetchChats error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  createGroupChat: async (req: Request, res: Response) => {
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

      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        // groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      console.error("createGroupChat error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
  renameGroup: async (req: Request, res: Response) => {
    try {
      const { chatId, chatName } = req.body;

      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName: chatName,
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(updatedChat);
      }
    } catch (error) {
      console.error("renameGroup error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  removeFromGroup: async (req: Request, res: Response) => {
    try {
      const { chatId, userId } = req.body;

      // check if the requester is admin

      const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(removed);
      }
    } catch (error) {
      console.error("removeFromGroup error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  addToGroup: async (req: Request, res: Response) => {
    try {
      const { chatId, userId } = req.body;

      // check if the requester is admin

      const added = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(added);
      }
    } catch (error) {
      console.error("addToGroup error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
};
