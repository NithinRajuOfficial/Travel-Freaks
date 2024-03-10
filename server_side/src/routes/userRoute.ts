import express, { Router } from 'express'
import {userController} from '../controller/userController'
import { commentController } from '../controller/commentController'
import { verifyAccessTokenMiddleware } from '../authService/accessTokenVerificationMiddleware'
import roleCheckMiddleware from '../authService/roleCheckMiddleware'
import { ROLE } from '../config/constants'
import multer, { Multer } from 'multer';
import { handleFileUpload } from '../config/multerConfig'
import { chatController } from '../controller/chatController'
const userRoute = express.Router()


// Route for adding posts
userRoute.post('/addPost',verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),handleFileUpload('image'),userController.addPost)

// Route for updating post details
userRoute.patch("/editPost/:postId",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),handleFileUpload('image'),userController.updatePost)

// Route for getting all posts
userRoute.get("/getAllPosts",userController.getAllPosts)

// Route for getting the user details
userRoute.get('/userDetails/:userId?',verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.getUserDetails)

// Route for getting all users
userRoute.get('/getAllUsers',verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.getAllUsers)

// Route for updating the user details 
userRoute.patch("/updateUserDetails",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),handleFileUpload('profileImage'),userController.updateUserDetails)

// Route for getting the post details
userRoute.get("/postDetails",userController.getPostDetails)

// Route for adding or updating the user cover image 
userRoute.post("/editCoveImg",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),handleFileUpload('coverImg'),userController.addOrUpdateUserCoverImg)

// Route for adding a comment
userRoute.post("/addComment",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),commentController.addComment)

// Route for getting the comments
userRoute.get("/getComments/:postId",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),commentController.getComments)

// Route to follow and unfollow a user
userRoute.post("/follow&unfollow",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.addToFollowing)

// Route to get the following list
userRoute.get("/following",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.getFollowingList)

// Route to get all the followers list
userRoute.get("/followers",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.getFollowersList)
// Route to delete a post
userRoute.delete("/deletePost/:postId",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.deletePost)

// Route to delete a comment
userRoute.delete("/deleteComment/:commentId",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),commentController.deleteComment)

// Route to like or unlike a post
userRoute.post("/likeOrUnlike/:postId",verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),userController.likeOrUnlike)

// Route to search friends
userRoute.get('/search',verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),chatController.searchUser)

// Route to fetch chats 
userRoute.get('/accessChats/:userId',verifyAccessTokenMiddleware,roleCheckMiddleware(ROLE.user),chatController.accessChat)
export default userRoute;