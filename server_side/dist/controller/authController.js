"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { generateJWT as generateToken } from "../authService/JwtAuth";
const userSchema_1 = require("../models/userSchema");
const adminSchema_1 = require("../models/adminSchema");
const constants_1 = require("../config/constants");
const nodemailerConfig_1 = __importDefault(require("../config/nodemailerConfig"));
const JwtAuth_1 = require("../authService/JwtAuth");
const mongoose_1 = __importDefault(require("mongoose"));
exports.authController = {
    // Refresh Token Route
    verificationOfRefreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            // verify the refresh token
            const { userId, role } = (0, JwtAuth_1.verifyRefershToken)(refreshToken);
            if (!userId || !role) {
                // refresh token i invalid or expired
                return res.status(401).json({ error: "Invalid refresh token" });
            }
            // generating new access token
            const accessToken = (0, JwtAuth_1.generateAccessToken)(userId.toString(), role);
            // sending the new access token
            res.status(200).json({ accessToken });
        }
        catch (error) {
            console.error("Refresh Token Error:", error);
            res.status(500).json({ error: "Refresh Token failed" });
        }
    }),
    // User signup
    userSignup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Checking if the email already exists
            const existingUser = yield userSchema_1.User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            // hashing password
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
            // Creating a new User
            const newUser = new userSchema_1.User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                activityType: "login",
            });
            // Generating access token
            const userId = newUser._id;
            const accessToken = (0, JwtAuth_1.generateAccessToken)(userId.toString(), constants_1.ROLE.user);
            // Generating refresh token
            const refreshToken = (0, JwtAuth_1.generateRefreshToken)(userId.toString(), constants_1.ROLE.user);
            // Calculating the expiration date for the refresh token
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            // Storing the refresh token and its expiration to the database
            newUser.refreshTokens.push({
                token: refreshToken,
                expires: expirationDate,
            });
            // Saving user data to database
            const savedUser = yield newUser.save();
            // Response with Token and User data
            res.status(201).json({ accessToken, refreshToken, user: savedUser });
        }
        catch (error) {
            console.error("Registration error", error);
            res.status(500).json({ error: "Registration failed" });
        }
    }),
    //User login
    userLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find the user by email
            const user = yield userSchema_1.User.findOne({ email: req.body.email });
            // Checking if the user exist
            if (!user) {
                return res.status(401).json({ error: "Invalid Email or Password" });
            }
            // checking the block status of the user
            if (user.blockStatus) {
                return res.status(403).json({ error: "You are Blocked" });
            }
            // Comparing the password with password in the database
            const passwordMatch = yield bcrypt_1.default.compare(req.body.password, user.password);
            // if password doesn't match
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid Email or Password" });
            }
            // Assuming you have a user object with their ID
            const userId = user._id;
            // Generate access
            const accessToken = (0, JwtAuth_1.generateAccessToken)(userId.toString(), constants_1.ROLE.user);
            // Finding a valid refreshToken in user array
            let refreshTokenData = user.refreshTokens.find((tokenData) => {
                return new Date(tokenData.expires) > new Date();
            });
            //if there is no valid refreshToken available
            if (!refreshTokenData) {
                const refreshToken = (0, JwtAuth_1.generateRefreshToken)(userId.toString(), constants_1.ROLE.user);
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);
                refreshTokenData = {
                    token: refreshToken,
                    expires: expirationDate,
                };
                user.refreshTokens.push(refreshTokenData);
            }
            user.activityType = "login";
            yield user.save();
            const refreshToken = refreshTokenData.token;
            // Sending Response to the client with token and user data
            res.status(200).json({ accessToken, refreshToken, user });
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Login failed" });
        }
    }),
    // Logout of User
    userLogout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extracting access token from the request
            const refreshTokenHeader = req.headers["authorization"];
            if (!refreshTokenHeader) {
                return res.status(401).json({ error: "Authorization header missing" });
            }
            const [Bearer, refreshToken] = refreshTokenHeader.trim().split(" ");
            console.log(refreshToken, "[[[[[[");
            // Split the header to get the token after "Bearer"
            const { userId } = (0, JwtAuth_1.verifyRefershToken)(refreshToken);
            if (!userId) {
                return res.status(401).json({ error: "Invalid refresh token" });
            }
            // Set the activity type to "logout" for the user
            const user = yield userSchema_1.User.findOne({ _id: userId });
            if (user) {
                user.activityType = "logout";
                yield user.save();
            }
            const removedRefreshToken = yield userSchema_1.User.updateOne({ _id: userId }, { $pull: { refreshTokens: { token: refreshToken } } }, { new: true });
            res.status(200).json({ message: "Logout successful" });
        }
        catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({ error: "Logout Failed" });
        }
    }),
    // google authentication of the user
    googleAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const generateRandomPassword = () => {
                return bcrypt_1.default.hashSync(Math.random().toString(36).slice(-8), 10);
            };
            const existingUser = yield userSchema_1.User.findOne({ email: req.body.email });
            let user;
            if (existingUser) {
                user = existingUser;
            }
            else {
                user = new userSchema_1.User({
                    name: req.body.name,
                    email: req.body.email,
                    profileImage: req.body.profileImage,
                    password: generateRandomPassword(),
                    loginActivity: "login",
                });
            }
            const userId = user._id;
            const accessToken = (0, JwtAuth_1.generateAccessToken)(userId.toString(), constants_1.ROLE.user);
            const refreshToken = (0, JwtAuth_1.generateRefreshToken)(userId.toString(), constants_1.ROLE.user);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            user.refreshTokens.push({
                token: refreshToken,
                expires: expirationDate,
            });
            if (existingUser) {
                // If the user already exists, update their profile and refresh token.
                const updatedUser = yield user.save();
                const _a = updatedUser.toObject(), { password } = _a, userResponse = __rest(_a, ["password"]);
                res.status(200).json({ accessToken, refreshToken, user: userResponse });
            }
            else {
                // If it's a new user, save them and return access and refresh tokens.
                const savedUser = yield user.save();
                const _b = savedUser.toObject(), { password } = _b, userResponse = __rest(_b, ["password"]);
                res.status(201).json({ accessToken, refreshToken, user: userResponse });
            }
        }
        catch (error) {
            console.error("Unable to authenticate using Google:", error);
            res.status(500).json({ error: "Authentication failed" });
        }
    }),
    // sending otp to the specified email
    sendOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // extracting email from body
            const email = req.body.email;
            // checking the email in db
            const user = yield userSchema_1.User.findOne({ email });
            if (user) {
                // generating otp
                let otp = (0, constants_1.generateOTP)();
                console.log(otp, "new otp");
                // updating the users document with the generated OTP
                user.otp = otp;
                yield user.save();
                // mail contents and details
                const mailOptions = {
                    from: process.env.ADMIN_MAIL_ID,
                    to: email,
                    subject: "OTP Verification",
                    text: `You OTP code is ${otp}`,
                };
                // calling the function from the nodemailer config
                nodemailerConfig_1.default.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending OTP email:", error);
                        res.status(500).json({ error: "Error happened while sending OTP" });
                    }
                    else {
                        console.error("OTP email sent:", info.response);
                        res.status(200).json({ message: "OTP send successfully" });
                    }
                });
            }
            else {
                res.status(400).json({ error: "Entered email doesn't match" });
            }
        }
        catch (error) {
            console.error("Error happened while sending otp:", error);
            res.status(500).json({ error: "Error happened while sending otp" });
        }
    }),
    // verification of the OTP
    verifyOtp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp, email } = req.body;
            console.log(otp, "otppp ");
            //finding the user with that email
            const user = yield userSchema_1.User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "User not found" });
            }
            const userId = user === null || user === void 0 ? void 0 : user._id;
            const accessToken = (0, JwtAuth_1.generateAccessToken)(userId.toString(), constants_1.ROLE.user);
            const refreshToken = (0, JwtAuth_1.generateRefreshToken)(userId.toString(), constants_1.ROLE.user);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            user.activityType = "login";
            user === null || user === void 0 ? void 0 : user.refreshTokens.push({
                token: refreshToken,
                expires: expirationDate,
            });
            yield (user === null || user === void 0 ? void 0 : user.save());
            // matching the otp of the users db with the otp which entered
            if (otp === user.otp) {
                res.status(201).json({
                    message: "OTP matched, user successfully logged in",
                    accessToken,
                    refreshToken,
                    user,
                });
            }
            else {
                res.status(400).json({ message: "OTP doesn't match, retry please" });
            }
        }
        catch (error) {
            console.error("Error happened while verification of OTP");
            res
                .status(500)
                .json({ error: "Error happened while verification of OTP" });
        }
    }),
    // admin side
    // Route for admin login
    adminLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // trying to find admin username in the database
            const admin = yield adminSchema_1.Admin.findOne({ userName: req.body.userName });
            // if the username didnt match
            if (!admin) {
                return res.status(404).json({ error: "admin not found" });
            }
            // comparing the password with the database
            const passwordMatch = bcrypt_1.default.compare(req.body.password, admin.password);
            // if password didnt matched
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }
            // assuming that we got the admin id
            const adminId = admin._id;
            // generating access token
            const accessToken = (0, JwtAuth_1.generateAccessToken)(adminId.toString(), constants_1.ROLE.admin);
            // finding a valid refreshToken in the admin array
            let refreshTokenData = admin === null || admin === void 0 ? void 0 : admin.refreshTokens.find((tokenData) => {
                return new Date(tokenData.expires) > new Date();
            });
            // if there is no valid refreshToken available
            if (!refreshTokenData) {
                const refreshToken = (0, JwtAuth_1.generateRefreshToken)(adminId.toString(), constants_1.ROLE.admin);
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);
                refreshTokenData = {
                    token: refreshToken,
                    expires: expirationDate,
                };
                admin === null || admin === void 0 ? void 0 : admin.refreshTokens.push(refreshTokenData);
            }
            yield (admin === null || admin === void 0 ? void 0 : admin.save());
            const refreshToken = refreshTokenData.token;
            const adminWithoutPassword = {
                _id: admin._id,
                userName: admin.userName,
            };
            // sending Response to the client with token and admin details
            return res
                .status(200)
                .json({ accessToken, refreshToken, admin: adminWithoutPassword });
        }
        catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }),
    // function for admin logout
    adminLogout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("wow");
        try {
            const refreshTokenHeader = req.headers["authorization"];
            if (!refreshTokenHeader) {
                return res.status(401).json({ error: "Authorization header missing" });
            }
            const [Bearer, refreshToken] = refreshTokenHeader.trim().split(" ");
            const { userId } = (0, JwtAuth_1.verifyRefershToken)(refreshToken);
            if (!userId) {
                return res.status(401).json({ error: "Invalid refresh token" });
            }
            const adminId = new mongoose_1.default.Types.ObjectId(userId);
            const admin = yield adminSchema_1.Admin.findById(adminId);
            if (admin) {
                yield adminSchema_1.Admin.updateOne({ _id: admin }, { $pull: { refreshTokens: { token: refreshToken } } }, { new: true });
                return res.status(200).json({ message: "Logout Successful" });
            }
        }
        catch (error) {
            console.error("Unable to logout:", error);
            res.status(500).json({ error: "Logout Error:" });
        }
    }),
};
