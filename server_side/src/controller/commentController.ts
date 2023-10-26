import { Request, Response } from "express";
import { CustomRequest } from "../config/constants";
import { Comment as CommentModel } from "../models/commentSchema";
import { User as UserModel } from "../models/userSchema";
import { Post as PostModel } from "../models/postSchema";

export const commentController = {
  // Adding comment
  addComment: async (req: Request, res: Response) => {
    try {
      const { userId, postId, comment } = req.body;
      

      if (!comment || comment.trim() === "") {        
        return res.status(400).json({ error: "Comment cant be empty" });
      }

      const existingUser = await UserModel.findById(userId);
      const existingPost = await PostModel.findById(postId);
      const commentText = comment.trim()

      if (!existingUser || !existingPost) {        
        return res.status(404).json({ error: "User or Post is not found" });
      }

      const commentData = new CommentModel({
        userId,
        postId,
        commentText,
      });

      await commentData.save();
      return res.status(201).json({message:"Comment added successfully",commentText})
    } catch (error) {
      console.error("Add Comment Error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // getting comments
  getComments:async(req:Request,res:Response)=>{
    try {
      const postId = req.params.postId;
      const {skip,limit} = req.query
      const skipValue = typeof skip === 'string' ? parseInt(skip) : 0;
      const limitValue = typeof limit === 'string' ? parseInt(limit) : 0;

      const totalNoOfComments = (await CommentModel.find({postId}).count())
      
      const allComments = await CommentModel.find({postId}).populate({
        path:'userId', select: '_id name   profileImage'
      }).skip(skipValue).limit(limitValue).sort({createdAt:-1})
      
      if(!allComments){
        return res.status(404).json({error:"Failed to get all comments with the specified Post Id"})
      }

      res.status(201).json({message:"Successfully got all comments",allComments,totalNoOfComments})
      
    } catch (error) {
      console.error("Getting all Comments error:",error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // function to delete a comment 
  deleteComment: async(req:Request,res:Response) => {
    try {
      const commentId = req.params.commentId
      const deletedComment = await CommentModel.deleteOne({_id: commentId})
      console.log(deletedComment,"--==");
      res.status(200).json({message:"Comment Successfully deleted"})
      
    } catch (error) {
      console.error("Something went wrong while deleting the comment, please try again");
      res.status(500).json({error:"Server Error"})
    }
  },

 
  
};
