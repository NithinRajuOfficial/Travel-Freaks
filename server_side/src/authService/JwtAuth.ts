import jwt from "jsonwebtoken";
import { configKeys } from "../config/configKeys";

export const generateJWT = (payload: string) => {
  const jwtPayload = { unique_id: payload };
  if (configKeys.JWT_SECRET_KEY) {
    return jwt.sign(jwtPayload, configKeys.JWT_SECRET_KEY, {
      expiresIn: configKeys.JWT_EXPIRATION,
    });
  }
};

export const verifyJWT = (token: string) => {
  if (configKeys.JWT_SECRET_KEY) {
    return jwt.verify(token, configKeys.JWT_SECRET_KEY);
  }
};

// Function to generate an access token
export const generateAccessToken = (userId: any) => {
  return jwt.sign({ userId }, configKeys.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  }); // Token expires in 15 minutes
};

// Function to generate a refresh token
export const generateRefreshToken = (userId:any) => {
  return jwt.sign({userId}, configKeys.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Token expires in 7 days
};

//   Funtion to verify the refresh token
interface JwtPayload {
  exp: any;
  userId: string; // Adjust the type of userId as needed
  // Add any other fields you expect in the payload
}
export const verifyRefershToken = (refreshToken: string): string | null => {
    try {
        const decoded = jwt.verify(
          refreshToken,
          configKeys.REFRESH_TOKEN_SECRET
        ) as JwtPayload;
            
        const userId = decoded.userId;
      
        return userId;
      } catch (error:any) {
        console.error("Refresh Token Verification Error:", error.message);
        return null;
      }
      
};

// Function to verify access token
export const verifyAccessToken = (accessToken: string): string | null => {
  try {    
    const decoded = jwt.verify(
      accessToken,
      configKeys.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    const userId = decoded.userId;
    
    return userId;
  } catch (error) {
    console.log(error, "Verification of Access Token has failed");
    return null;
  }
};
