import { Request, Response, json } from "express";
import bcrypt from "bcrypt";
// import { generateJWT as generateToken } from "../authService/JwtAuth";
import { User as UserModel } from "../models/userSchema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefershToken,
  verifyAccessToken,
} from "../authService/JwtAuth";

export const authController = {
  
  // Refresh Token Route
  verificationOfRefreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // verify the refresh token
      const userId = verifyRefershToken(refreshToken);

      if (!userId) {
        // refresh token i invalid or expired
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      // generating new access token
      const accessToken = generateAccessToken(userId);

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
      console.log(req.body, "body");

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
      });

      // Generating access token
      const userId = newUser._id;
      console.log(userId, "userId...");
      const accessToken = generateAccessToken(userId);

      // Generating refresh token
      const refreshToken = generateRefreshToken(userId);

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

      // Comparing the password with password in the database
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // if password doesnt match
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid Email or Password" });
      }

      // Assuming you have a user object with their ID
      const userId = user._id;

      // Generate access
      const accessToken = generateAccessToken(userId);

      console.log(accessToken, "acess2");

      // Finding a valid refreshToken in user array
      let refreshTokenData = user.refreshTokens.find((tokenData) => {
        console.log(tokenData,'tokenn........////');
        return new Date(tokenData.expires) > new Date();
      });

      //if there is no valid refreshToken available
      if (!refreshTokenData) {
        const refreshToken = generateRefreshToken(userId);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        refreshTokenData = {
          token: refreshToken,
          expires: expirationDate,
        };
        user.refreshTokens.push(refreshTokenData);
      }

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

    const [, refreshToken] = refreshTokenHeader.split(" "); // Split the header to get the token after "Bearer"
      const userId = verifyRefershToken(refreshToken);
      console.log(userId,"logout user");
      
      if (!userId) {
        return res.status(401).json({ error: "Invalid access token" });
      }
      const removedRefreshToken = await UserModel.updateOne({ _id: userId }, { $pull: { refreshTokens: { token: refreshToken   } } },{new:true});
      console.log(removedRefreshToken,'removedToken');
      console.log(`Refresh token removed for user with ID: ${userId}`);

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout Failed" });
    }
  },
};
