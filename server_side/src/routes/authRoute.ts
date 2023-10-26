import express from "express";
const authRoute = express.Router();
import { verifyAccessTokenMiddleware } from '../authService/accessTokenVerificationMiddleware'
import roleCheckMiddleware from '../authService/roleCheckMiddleware'
import { ROLE } from '../config/constants'
import { authController } from "../controller/authController";


// user side
// Refresh Token Route
authRoute.post('/refresh',authController.verificationOfRefreshToken)

//Signup Route of User
authRoute.post("/signup", authController.userSignup);

// Login Route of User
authRoute.post("/login", authController.userLogin)

// Logout Route of User
authRoute.post("/logout",authController.userLogout)

// google authentication
authRoute.post("/googleAuth",authController.googleAuth)

// Route for sending otp to the specified email
authRoute.post("/sendOtp",authController.sendOTP)

// Route for verifying otp
authRoute.post("/verifyOtp",authController.verifyOtp)

// admin side
// Route for admin login
authRoute.post("/admin/login",authController.adminLogin)

// Route for admin logout
authRoute.post("/admin/logout",authController.adminLogout)

export default authRoute;
