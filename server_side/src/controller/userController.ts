import { Request, Response } from "express";
import multer, { MulterError } from "multer"; // Import MulterError
import bcrypt from "bcrypt";
import { upload } from "../config/multerConfig";
import { User as UserModel } from "../models/userSchema";
import { Post as PostModel } from "../models/postSchema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefershToken,
  verifyAccessToken,
} from "../authService/JwtAuth";

export const userController = {
  // adding post
  addPost: async (req: Request, res: Response) => {
    try {
      // Retrieve userId from the custom response header
      const userId = res.get("X-UserId");

      // Handling file uploading using multer
      upload.single("image")(req, res, async (err: any) => {
        if (err instanceof MulterError) {
          return res.status(400).json({ error: "File upload error" });
        } else if (err) {
          return res.status(500).json({ error: "Server Error" });
        }

        // Change req.files to Express.Multer.File[]
        const file = req.file?.path as unknown as Express.Multer.File;
        //Checking if the files got uploaded
        if (!file) {
          return res.status(400).json({ error: "No Files uploaded" });
        }

        // Extracting post data from the request
        const {
          title,
          description,
          startDate,
          endDate,
          location,
          itinerary,
          budget,
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
          budget: JSON.parse(budget),
          maxNoOfPeoples: maxNoOfPeoples,
        });

        // Save the new post
        await newPost.save();
        // Sending back the response
        res
          .status(201)
          .json({ message: "Post added successfully", post: newPost });
      });
    } catch (error) {
      console.error("Add Post error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // getting all posts from database
  getAllPosts: async (req: Request, res: Response) => {
    try {
      // fetching all posts from database
      const posts = await PostModel.find().sort({ _id: -1 }).limit(10);
      res
        .status(201)
        .json({ message: "Succussfully got all posts", allPosts: posts });
    } catch (error) {
      console.error("Unable to fetch all Posts:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // getting user details
  getUserDetails: async (req: Request, res: Response) => {
    try {
      console.log("came over user details route");
      // Retrieve userId from the custom response header
      const userId = res.get("X-UserId");

      // retriving data of that particular user from the database
      const userDetails = await UserModel.findById(userId);
      console.log(userDetails, "details ....");

      // condition to handle error case in the getting the userDetails
      if (!userDetails) {
        res.status(400).json({ error: "Failed to get the user details" });
      }

      res
        .status(201)
        .json({
          message: "Successfully got the details of the user",
          userDetails: userDetails,
        });
    } catch (error) {
      console.error("Unable to fetch user details:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // Updating user details
  updateUserDetails: async (req: Request, res: Response) => {
    try {
      // Retrieve userId from the custom response header
      const userId = res.get("X-UserId");

      upload.single("profileImage")(req, res, async (err: any) => {
        if (err instanceof MulterError) {
          console.log("multer error..");

          return res.status(400).json({ error: "File upload error" });
        } else if (err) {
          console.log("eslse if erreie");

          return res.status(500).json({ error: "Server Error" });
        }

        // Change req.files to Express.Multer.File[]
        const file = req.file?.path as unknown as Express.Multer.File;
        //Checking if the files got uploaded
        if (!file) {
          return res.status(400).json({ error: "No Files uploaded" });
        }
        console.log(req.file, "req.file");
        console.log(file, "file..");

        //matching the user id with db to get the specific user
        const user = await UserModel.findById(userId);
        console.log(user, "user-----");

        console.log(req.body, "-==-==+++");
        if (!user) {
          res.status(404).json({ error: "User not found" });
        }

        if (user?.name !== req.body.name) {
          user!.name = req.body.name;
        }

        if (user?.bio !== req.body.bio) {
          user!.bio = req.body.bio;
        }

        if (user?.email !== req.body.email) {
          user!.email = req.body.email;
        }

        user!.profileImage = file ? (file as unknown as string) : undefined;

        //now matching the old password entered with the password in the db
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

        await user?.save();
        res.status(201).json({ message: "Successfully updated user data" });

        if (!isPasswordMatch) {
          res.status(404).json({ error: "Entered Password doesnt match" });
        }
      });
    } catch (error) {
      console.error("Unable to update user details:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
};
