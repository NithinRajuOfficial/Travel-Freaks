"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoute = express_1.default.Router();
const authController_1 = require("../controller/authController");
// user side
// Refresh Token Route
authRoute.post('/refresh', authController_1.authController.verificationOfRefreshToken);
//Signup Route of User
authRoute.post("/signup", authController_1.authController.userSignup);
// Login Route of User
authRoute.post("/login", authController_1.authController.userLogin);
// Logout Route of User
authRoute.post("/logout", authController_1.authController.userLogout);
// google authentication
authRoute.post("/googleAuth", authController_1.authController.googleAuth);
// Route for sending otp to the specified email
authRoute.post("/sendOtp", authController_1.authController.sendOTP);
// Route for verifying otp
authRoute.post("/verifyOtp", authController_1.authController.verifyOtp);
// admin side
// Route for admin login
authRoute.post("/admin/login", authController_1.authController.adminLogin);
// Route for admin logout
authRoute.post("/admin/logout", authController_1.authController.adminLogout);
exports.default = authRoute;
