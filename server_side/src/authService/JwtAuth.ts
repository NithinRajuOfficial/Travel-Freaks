import jwt from "jsonwebtoken";
import { configKeys } from "../config/configKeys";

export const generateJWT = (payload: { id: string; role: string }) => {
  if (configKeys.JWT_SECRET_KEY) {
    return jwt.sign(
      { unique_id: payload.id, role: payload.role },
      configKeys.JWT_SECRET_KEY,
      {
        expiresIn: configKeys.JWT_EXPIRATION,
      }
    );
  }
};

export const verifyJWT = (token: string) => {
  if (configKeys.JWT_SECRET_KEY) {
    return jwt.verify(token, configKeys.JWT_SECRET_KEY);
  }
};

// Function to generate an access token
export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, configKeys.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  }); // Token expires in 15 minutes
};

// Function to generate a refresh token
export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, configKeys.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  }); // Token expires in 7 days
};

//   Function to verify the refresh token
interface JwtPayload {
  statusCode: number;
  exp: any;
  userId: string; // Adjust the type of userId as needed
  adminId: string,
  role: string;
  // Add any other fields you expect in the payload
}
export const verifyRefershToken = (refreshToken: string) => {
  try {
    
    const decoded = jwt.verify(
      refreshToken,
      configKeys.REFRESH_TOKEN_SECRET
    ) as JwtPayload;
    if (!decoded.userId || !decoded.role) {      
      throw new Error("Invalid token payload");
    }
    // const userId = decoded.userId;

    return { userId: decoded.userId, role: decoded.role };
  } catch (error: any) {
    console.log(error, "this is the error");
    throw new Error("Refresh Token Verification Error");
  }
};

// Function to verify access token
export const verifyAccessToken = (accessToken: string) => {
  try {
    const decoded = jwt.verify(
      accessToken,
      configKeys.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    // const userId = decoded.userId;

    return { 
      statusCode: 200, 
      error:false,
      message: "successfully verified token",
      userId: decoded.userId, 
      role: decoded.role };
  } catch (error) {
    console.log(error, "Verification of Access Token has failed");
     return {
      statusCode: 401, 
      error: true,
      message: "Access token has been expired",
      userId: null,
      role: null,
    }
  }
};
