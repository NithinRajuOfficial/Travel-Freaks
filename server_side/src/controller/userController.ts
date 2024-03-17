import { Request, Response } from "express";
import multer, { MulterError } from "multer"; // Import MulterError
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { handleFileUpload } from "../config/multerConfig";
import { User as UserModel } from "../models/userSchema";
import { Post as PostModel } from "../models/postSchema";
import { Followers, Following } from "../models/followRelationshipSchema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefershToken,
  verifyAccessToken,
} from "../authService/JwtAuth";
import { CustomRequest } from "../config/constants";

export const userController = {
  // adding post
  addPost: async (req: CustomRequest, res: Response) => {
    try {
      console.log(req.body);
      // Retrieve userId from the custom response header
      const userId = req.payload?.userId;
      // extracting file from the request header
      const file = req.uploadedFile;
      console.log(file)
      // Extracting post data from the request
      const {
        title,
        description,
        startDate,
        endDate,
        location,
        itinerary,
        amount,
        currency,
        maxNoOfPeoples,
      } = req.body;

      // Creating a new post
      const newPost = new PostModel({
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
      await newPost.save();
      // Sending back the response
      res
        .status(201)
        .json({ message: "Post added successfully", post: newPost });
    } catch (error) {
      console.error("Add Post error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // updating post details
  updatePost: async (req: Request, res: Response) => {
    try {
      console.log("came")
      const file = req.uploadedFile;
      const postId = req.params.postId;
      const itineraryObj = JSON.parse(req.body.itinerary);

      const matchedPost = await PostModel.findById(postId);

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

      if (
        req.body.currency !== matchedPost.budget?.currency ||
        req.body.amount !== matchedPost.budget?.amount
      ) {
        matchedPost.budget = {
          currency: req.body.currency,
          amount: req.body.amount,
        };
      }

      if (req.body.maxNoOfPeoples !== matchedPost.maxNoOfPeoples) {
        matchedPost.maxNoOfPeoples = req.body.maxNoOfPeoples;
      }

      if (file) {
        matchedPost.image = file && (file as unknown as string);
      }

      await matchedPost.save();
      res
        .status(201)
        .json({ message: "Successfully edited the post", post: matchedPost });
    } catch (error) {
      console.error("Update Post error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // getting all posts from database
  getAllPosts: async (req: Request, res: Response) => {
    try {
      // fetching all posts from database
      const posts = await PostModel.find().sort({ _id: -1 });
      res
        .status(201)
        .json({ message: "Successfully got all posts", allPosts: posts });
    } catch (error) {
      console.error("Unable to fetch all Posts:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // getting user details
  getUserDetails: async (req: CustomRequest, res: Response) => {
    try {
      // Retrieve userId from the custom response header
      // const userId = res.get("X-UserId");
      let userId;
      if (req.params.userId) {
        userId = req.params.userId;
      } else {
        userId = req.payload?.userId;
      }

      // retrieving data of that particular user from the database
      const userDetails = await UserModel.findById(userId);

      // condition to handle error case in the getting the userDetails
      if (!userDetails) {
        res.status(400).json({ error: "Failed to get the user details" });
      }

      // Check if the user identified by req.payload.userId follows the user identified by req.params.userId
      const followingDocument = await Following.findOne({
        userId: req.payload?.userId,
        followingId: userId,
      });

      const isFollowing = !!followingDocument; // Convert to a boolean indicating whether the following relationship exists

      res.status(201).json({
        message: "Successfully got the details of the user",
        userDetails: userDetails,
        isFollowing: isFollowing,
      });
    } catch (error) {
      console.error("Unable to fetch user details:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // Updating user details
  updateUserDetails: async (req: CustomRequest, res: Response) => {
    try {
      // Retrieve userId from the custom response header
      const userId = req.payload?.userId;
      const file = req.uploadedFile;

      //matching the user id with db to get the specific user
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user?.name !== req.body.name) {
        user!.name = req.body.name;
      }

      if (user?.bio !== req.body.bio) {
        user!.bio = req.body.bio.trim();
      }

      if (user?.email !== req.body.email) {
        user!.email = req.body.email;
      }
      if (file) {
        user!.profileImage = file && (file as unknown as string);
      }
      //now matching the old password entered with the password in the db
      if (req.body.oldPassword) {
        const isPasswordMatch = await bcrypt.compare(
          req.body.oldPassword,
          user!.password
        );

        if (isPasswordMatch) {
          const saltRounds = 10;
          const newPasswordHashed = await bcrypt.hash(
            req.body.newPassword,
            saltRounds
          );
          user!.password = newPasswordHashed;
        }

        if (!isPasswordMatch) {
          return res
            .status(400)
            .json({ error: "Entered Password doesn't match" });
        }
      }

      await user?.save();
      return res
        .status(201)
        .json({ message: "Successfully updated user data", user });
    } catch (error) {
      console.error("Unable to update user details:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // getting all users from the db
  getAllUsers: async (req: CustomRequest, res: Response) => {
    try {
      const loggedInUserId = req.payload?.userId;

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string);
      2;
      const skip = (page - 1) * pageSize;

      const followingIds = await Following.find({
        userId: loggedInUserId,
      }).distinct("followingId");
      const allUsersData = await UserModel.find({
        _id: { $nin: [...followingIds, loggedInUserId] },
      })
        .skip(skip)
        .limit(pageSize)
        .exec();

      const filteredUsersData = allUsersData.filter(
        (user) => user._id.toString() !== loggedInUserId
      );
      console.log(filteredUsersData);

      console.log(filteredUsersData, "filteredUsersData");
      res.status(201).json({
        message: "Successfully got all user data:",
        allUsersData: filteredUsersData,
      });

      if (!allUsersData) {
        res.status(400).json({ error: "Unable to get all users" });
      }
    } catch (error) {
      console.error("Unable to get all users:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // getting post details
  getPostDetails: async (req: Request, res: Response) => {
    try {
      console.log("mmm")
      const postId = req.query.postId;

      const postDetails = await PostModel.findById(postId).populate({
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
    } catch (error) {
      console.error("Unable to find the post details:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // Route for adding or updating the user cover img
  addOrUpdateUserCoverImg: async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.payload?.userId;
      const file = req.uploadedFile;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.coverImg = file && (file as unknown as string);

      await user?.save();
      return res
        .status(202)
        .json({ message: "Successfully updated user data", user });
    } catch (error) {
      console.error("Unable to add or update the cover image:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // to add a specific user to the following list
  addToFollowing: async (req: CustomRequest, res: Response) => {
    try {
      const idOfTheUserToBeFollowed = req.query.userIdToFollow;

      const userId = req.payload?.userId;
      // Checking id the user is already following the targeted user
      const existingFollowing = await Following.findOne({
        userId,
        followingId: idOfTheUserToBeFollowed,
      });

      if (existingFollowing) {
        // deleting entry from the following collection
        await Following.deleteOne({
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
      const followingEntry = new Following({
        userId,
        followingId: idOfTheUserToBeFollowed,
      });
      // save the following entry
      await followingEntry.save();

      // return success message
      return res.status(200).json({
        message: "User followed successfully",
        isFollowing: true,
        toUnfollow: false,
      });
    } catch (error) {
      console.error("Error occurred on following this user:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // to get the following list of the user
  getFollowingList: async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.payload?.userId;

      const followingList = await Following.find({ userId: userId }).populate(
        "followingId"
      );

      res.status(200).json({
        message: "Successfully got users following list",
        followingList,
      });
    } catch (error) {
      console.error(
        "Error occurred while fetching users following list:",
        error
      );
      res.status(500).json({ error: "Server Error" });
    }
  },

  // to get the followers list of the user
  getFollowersList: async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.payload?.userId;

      const followersList = await Following.find({
        followingId: userId,
      }).populate({ path: "userId", select: "name profileImage" });
      const followingList = await Following.find({ userId: userId }).populate({
        path: "followingId",
        select: "name profileImage",
      });

      let obj: { data: any; isFollowing: boolean }[] = [];
      followersList.forEach((follower) => {
        const isFollowing = followingList.some((following) =>
          following.followingId?.equals(follower?.userId!._id)
        );

        obj.push({ data: follower.userId, isFollowing });
      });

      res.status(200).json({
        message: "Successfully got users followers list",
        obj,
      });
    } catch (error) {
      console.error(
        "Error occurred while fetching users followers list:",
        error
      );
      res.status(500).json({ error: "Server Error" });
    }
  },

  // Route to delete a post
  deletePost: async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const deletedPost = await PostModel.deleteOne({ postId });
      console.log(deletedPost, "pp");

      res.status(200).json({ message: "Post successfully deleted" });
    } catch (error) {
      console.error("Error occurred while deleting the post:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // function to like or unlike a post
  likeOrUnlike: async (req: CustomRequest, res: Response) => {
    try {
      const postId = req.params.postId;
      const userId = req.payload?.userId;
      let currentLikeStatus = false;

      console.log(userId, "ppp");

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const post = await PostModel.findById(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Ensure userId is a non-null string before converting to ObjectId
      if (typeof userId === "string") {
        const userIdObject = new mongoose.Types.ObjectId(userId);

        // Check if the user has already liked the post
        const likedIndex = post.likes.findIndex((like) =>
          like.equals(userIdObject)
        );

        if (likedIndex !== -1) {
          // If the user has already liked the post, remove the like
          post.likes = post.likes.filter((like, index) => index !== likedIndex);
        } else {
          // If the user hasn't liked the post, add the like
          post.likes.push(userIdObject);
          currentLikeStatus = true;
        }
      }

      // Save the changes to the post
      await post.save();

      const numberOfLikes = post.likes.length;

      res.status(200).json({
        message: "Like/Unlike action successful",
        currentLikeStatus,
        numberOfLikes,
      });
    } catch (error) {
      console.error("Error occurred while like or unlike action:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },
};
