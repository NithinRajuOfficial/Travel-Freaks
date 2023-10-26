import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./JwtAuth";
import { CustomRequest } from "../config/constants";

export const verifyAccessTokenMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;    

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const accessToken = authorizationHeader.split(" ")[1];
    
    const payload = verifyAccessToken(accessToken);    

    if (payload.statusCode === 401) {
      return res.status(401).json({ error: "Invalid access token" });
    }
    req.payload = payload;
    next();

    // Set userId in a custom response header
    // res.set("X-UserId", userId);
  } catch (error) {    
    res.status(401).json({ error: "Invalid access token" });
  }
};
