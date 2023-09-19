import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./JwtAuth";

export const verifyAccessTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const accessToken = authorizationHeader.split(" ")[1];
  const userId = verifyAccessToken(accessToken);

  if (!userId) {
    return res.status(401).json({ error: "Invalid access token" });
  }

    // Set userId in a custom response header
    res.set("X-UserId", userId);

  next(); // Call next to continue with the route handler
};
