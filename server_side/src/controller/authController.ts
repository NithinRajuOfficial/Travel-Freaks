import { Request, Response, json } from "express";
import bcrypt from "bcrypt";
// import { generateJWT as generateToken } from "../authService/JwtAuth";
import { User as UserModel } from "../models/userSchema";
import { Admin as AdminModel } from "../models/adminSchema";
import { ROLE, generateOTP } from "../config/constants";
import transporter from "../config/nodemailerConfig";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefershToken,
  verifyAccessToken,
} from "../authService/JwtAuth";
import mongoose from "mongoose";

export const authController = {
  // Refresh Token Route
  verificationOfRefreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // verify the refresh token
      const { userId, role } = verifyRefershToken(refreshToken);

      if (!userId || !role) {
        // refresh token i invalid or expired
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      // generating new access token
      const accessToken = generateAccessToken(userId.toString(), role);

      // sending the new access token
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error("Refresh Token Error:", error);
      res.status(500).json({ error: "Refresh Token failed" });
    }
  },

  // User signup
  userSignup: async (req: Request, res: Response) => {
    try {
      // Checking if the email already exists
      const existingUser = await UserModel.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // hashing password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      // Creating a new User
      const newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        activityType: "login",
      });

      // Generating access token
      const userId = newUser._id;

      const accessToken = generateAccessToken(userId.toString(), ROLE.user);

      // Generating refresh token
      const refreshToken = generateRefreshToken(userId.toString(), ROLE.user);

      // Calculating the expiration date for the refresh token
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      // Storing the refresh token and its expiration to the database
      newUser.refreshTokens.push({
        token: refreshToken,
        expires: expirationDate,
      });

      // Saving user data to database
      const savedUser = await newUser.save();

      // Response with Token and User data
      res.status(201).json({ accessToken, refreshToken, user: savedUser });
    } catch (error) {
      console.error("Registration error", error);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  //User login
  userLogin: async (req: Request, res: Response) => {
    try {
      // Find the user by email
      const user = await UserModel.findOne({ email: req.body.email });

      // Checking if the user exist
      if (!user) {
        return res.status(401).json({ error: "Invalid Email or Password" });
      }

      // checking the block status of the user
      if (user.blockStatus) {
        return res.status(403).json({ error: "You are Blocked" });
      }

      // Comparing the password with password in the database
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // if password doesn't match
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid Email or Password" });
      }

      // Assuming you have a user object with their ID
      const userId = user._id;

      // Generate access
      const accessToken = generateAccessToken(userId.toString(), ROLE.user);

      // Finding a valid refreshToken in user array
      let refreshTokenData = user.refreshTokens.find((tokenData) => {
        return new Date(tokenData.expires) > new Date();
      });

      //if there is no valid refreshToken available
      if (!refreshTokenData) {
        const refreshToken = generateRefreshToken(userId.toString(), ROLE.user);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        refreshTokenData = {
          token: refreshToken,
          expires: expirationDate,
        };
        user.refreshTokens.push(refreshTokenData);
      }
      user.activityType = "login";
      await user.save();

      const refreshToken = refreshTokenData.token;

      // Sending Response to the client with token and user data
      res.status(200).json({ accessToken, refreshToken, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  },

  // Logout of User
  userLogout: async (req: Request, res: Response) => {
    try {
      // Extracting access token from the request
      const refreshTokenHeader = req.headers["authorization"];

      if (!refreshTokenHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }

      const [Bearer, refreshToken] = refreshTokenHeader.trim().split(" ");
      
      // Split the header to get the token after "Bearer"
      const { userId } = verifyRefershToken(refreshToken);

      if (!userId) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      // Set the activity type to "logout" for the user
      const user = await UserModel.findOne({ _id: userId });
      if (user) {
        user.activityType = "logout";
        await user.save();
      }

      const removedRefreshToken = await UserModel.updateOne(
        { _id: userId },
        { $pull: { refreshTokens: { token: refreshToken } } },
        { new: true }
      );

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout Failed" });
    }
  },

  // google authentication of the user
  googleAuth: async (req: Request, res: Response) => {
    try {
      const generateRandomPassword = () => {
        return bcrypt.hashSync(Math.random().toString(36).slice(-8), 10);
      };

      const existingUser = await UserModel.findOne({ email: req.body.email });

      let user;

      if (existingUser) {
        user = existingUser;
      } else {
        user = new UserModel({
          name: req.body.name,
          email: req.body.email,
          profileImage: req.body.profileImage,
          password: generateRandomPassword(),
          loginActivity: "login",
        });
      }

      const userId = user._id;

      const accessToken = generateAccessToken(userId.toString(), ROLE.user);
      const refreshToken = generateRefreshToken(userId.toString(), ROLE.user);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      user.refreshTokens.push({
        token: refreshToken,
        expires: expirationDate,
      });

      if (existingUser) {
        // If the user already exists, update their profile and refresh token.
        const updatedUser = await user.save();
        const { password, ...userResponse } = updatedUser.toObject();
        res.status(200).json({ accessToken, refreshToken, user: userResponse });
      } else {
        // If it's a new user, save them and return access and refresh tokens.
        const savedUser = await user.save();
        const { password, ...userResponse } = savedUser.toObject();
        res.status(201).json({ accessToken, refreshToken, user: userResponse });
      }
    } catch (error) {
      console.error("Unable to authenticate using Google:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  },

  // sending otp to the specified email
  sendOTP: async (req: Request, res: Response) => {
    try {
      // extracting email from body
      const email = req.body.email;
      // checking the email in db
      const user = await UserModel.findOne({ email });

      if (user) {
        // generating otp
        let otp = generateOTP();

        // updating the users document with the generated OTP
        user.otp = otp;
        await user.save();

        // mail contents and details
        const mailOptions = {
          from: process.env.ADMIN_MAIL_ID,
          to: email,
          subject: "OTP Verification",
          text: `You OTP code is ${otp}`,
        };

        // calling the function from the nodemailer config
        transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.error("Error sending OTP email:", error);
            res.status(500).json({ error: "Error happened while sending OTP" });
          } else {
            console.error("OTP email sent:", info.response);
            res.status(200).json({ message: "OTP send successfully" });
          }
        });
      } else {
        res.status(400).json({ error: "Entered email doesn't match" });
      }
    } catch (error) {
      console.error("Error happened while sending otp:", error);
      res.status(500).json({ error: "Error happened while sending otp" });
    }
  },

  // verification of the OTP
  verifyOtp: async (req: Request, res: Response) => {
    try {
      const { otp, email } = req.body;

      //finding the user with that email
      const user = await UserModel.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      const userId = user?._id;

      const accessToken = generateAccessToken(userId!.toString(), ROLE.user);
      const refreshToken = generateRefreshToken(userId!.toString(), ROLE.user);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      user!.activityType = "login";

      user?.refreshTokens.push({
        token: refreshToken,
        expires: expirationDate,
      });

      await user?.save();

      // matching the otp of the users db with the otp which entered
      if (otp === user!.otp) {
        res.status(201).json({
          message: "OTP matched, user successfully logged in",
          accessToken,
          refreshToken,
          user,
        });
      } else {
        res.status(400).json({ message: "OTP doesn't match, retry please" });
      }
    } catch (error) {
      console.error("Error happened while verification of OTP");
      res
        .status(500)
        .json({ error: "Error happened while verification of OTP" });
    }
  },

  // admin side

  // Route for admin login
  adminLogin: async (req: Request, res: Response) => {
    try {
      // trying to find admin username in the database
      const admin = await AdminModel.findOne({ userName: req.body.userName });

      // if the username didnt match
      if (!admin) {
        return res.status(404).json({ error: "admin not found" });
      }

      // comparing the password with the database
      const passwordMatch = bcrypt.compare(req.body.password, admin.password);

      // if password didnt matched
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // assuming that we got the admin id
      const adminId = admin!._id;

      // generating access token
      const accessToken = generateAccessToken(adminId.toString(), ROLE.admin);

      // finding a valid refreshToken in the admin array
      let refreshTokenData = admin?.refreshTokens.find((tokenData) => {
        return new Date(tokenData.expires) > new Date();
      });

      // if there is no valid refreshToken available
      if (!refreshTokenData) {
        const refreshToken = generateRefreshToken(
          adminId.toString(),
          ROLE.admin
        );
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        refreshTokenData = {
          token: refreshToken,
          expires: expirationDate,
        };
        admin?.refreshTokens.push(refreshTokenData);
      }

      await admin?.save();
      const refreshToken = refreshTokenData.token;

      const adminWithoutPassword = {
        _id: admin._id,
        userName: admin.userName,
      };

      // sending Response to the client with token and admin details
      return res
        .status(200)
        .json({ accessToken, refreshToken, admin: adminWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // function for admin logout
  adminLogout: async (req: Request, res: Response) => {
    console.log("wow");
    
    try {
      const refreshTokenHeader = req.headers["authorization"];
      
      if (!refreshTokenHeader) {        
        return res.status(401).json({ error: "Authorization header missing" });
      }

      const [Bearer, refreshToken] = refreshTokenHeader.trim().split(" ");
      
      const { userId } = verifyRefershToken(refreshToken);

      if (!userId) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      const adminId = new mongoose.Types.ObjectId(userId)
      
      const admin = await AdminModel.findById( adminId );
      
      if (admin) {
        await AdminModel.updateOne(
          { _id: admin },
          { $pull: { refreshTokens: { token: refreshToken } } },
          { new: true }
        );
        return res.status(200).json({ message: "Logout Successful" });
      }
    } catch (error) {
      console.error("Unable to logout:", error);
      res.status(500).json({ error: "Logout Error:" });
    }
  },
};
