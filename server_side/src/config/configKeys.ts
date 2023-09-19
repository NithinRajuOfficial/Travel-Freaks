import dotENV from "dotenv";

dotENV.config();

export const configKeys = {
  PORT: process.env.PORT as any,
  MONGODB_URL: process.env.MONGODB_URL as string,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  CLOUD_NAME:process.env.CLOUD_NAME as string,
  CLOUD_API_KEY:process.env.CLOUD_API_KEY as string,
  CLOUD_API_SECRET:process.env.CLOUD_API_SECRET as string
};
