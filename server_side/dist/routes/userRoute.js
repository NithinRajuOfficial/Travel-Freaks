"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const commentController_1 = require("../controller/commentController");
const accessTokenVerificationMiddleware_1 = require("../authService/accessTokenVerificationMiddleware");
const roleCheckMiddleware_1 = __importDefault(require("../authService/roleCheckMiddleware"));
const constants_1 = require("../config/constants");
const multerConfig_1 = require("../config/multerConfig");
const chatController_1 = require("../controller/chatController");
const userRoute = express_1.default.Router();
// Route for adding posts
userRoute.post('/addPost', accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), (0, multerConfig_1.handleFileUpload)('image'), userController_1.userController.addPost);
// Route for updating post details
userRoute.patch("/editPost/:postId", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), (0, multerConfig_1.handleFileUpload)('image'), userController_1.userController.updatePost);
// Route for getting all posts
userRoute.get("/getAllPosts", userController_1.userController.getAllPosts);
// Route for getting the user details
userRoute.get('/userDetails/:userId?', accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.getUserDetails);
// Route for getting all users
userRoute.get('/getAllUsers', accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.getAllUsers);
// Route for updating the user details 
userRoute.patch("/updateUserDetails", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), (0, multerConfig_1.handleFileUpload)('profileImage'), userController_1.userController.updateUserDetails);
// Route for getting the post details
userRoute.get("/postDetails", userController_1.userController.getPostDetails);
// Route for adding or updating the user cover image 
userRoute.post("/editCoveImg", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), (0, multerConfig_1.handleFileUpload)('coverImg'), userController_1.userController.addOrUpdateUserCoverImg);
// Route for adding a comment
userRoute.post("/addComment", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), commentController_1.commentController.addComment);
// Route for getting the comments
userRoute.get("/getComments/:postId", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), commentController_1.commentController.getComments);
// Route to follow and unfollow a user
userRoute.post("/follow&unfollow", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.addToFollowing);
// Route to get the following list
userRoute.get("/following", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.getFollowingList);
// Route to get all the followers list
userRoute.get("/followers", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.getFollowersList);
// Route to delete a post
userRoute.delete("/deletePost/:postId", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.deletePost);
// Route to delete a comment
userRoute.delete("/deleteComment/:commentId", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), commentController_1.commentController.deleteComment);
// Route to like or unlike a post
userRoute.post("/likeOrUnlike/:postId", accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), userController_1.userController.likeOrUnlike);
// Route to search friends
userRoute.get('/search', accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), chatController_1.chatController.searchUser);
// Route to fetch chats 
userRoute.get('/accessChats/:userId', accessTokenVerificationMiddleware_1.verifyAccessTokenMiddleware, (0, roleCheckMiddleware_1.default)(constants_1.ROLE.user), chatController_1.chatController.accessChat);
exports.default = userRoute;
