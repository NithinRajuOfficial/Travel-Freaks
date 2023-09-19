import express from "express";
const authRoute = express.Router();
import { authController } from "../controller/authController";

// Refresh Token Route
authRoute.post('/refresh',authController.verificationOfRefreshToken)
//Signup Route of User
authRoute.post("/signup", authController.userSignup);

// Login Route of User
authRoute.post("/login", authController.userLogin)

// Logout Route of User
authRoute.post("/logout",authController.userLogout)

export default authRoute;
