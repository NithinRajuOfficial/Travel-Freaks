import express from 'express'
import {userController} from '../controller/userController'
import { verifyAccessTokenMiddleware } from '../authService/accessTokenVerificationMiddleware'
import { upload } from '../config/multerConfig'
const userRoute = express.Router()

// Route for adding posts
userRoute.post('/addPost',verifyAccessTokenMiddleware,userController.addPost)

// Route for getting all posts
userRoute.get("/getAllPosts",verifyAccessTokenMiddleware,userController.getAllPosts)

// Route for getting the user details
userRoute.get('/userDetails',verifyAccessTokenMiddleware,userController.getUserDetails)

// Route for updating the user details 
userRoute.patch("/updateUserDetails",verifyAccessTokenMiddleware,userController.updateUserDetails)
export default userRoute;