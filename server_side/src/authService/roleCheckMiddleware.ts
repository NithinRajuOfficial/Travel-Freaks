import { NextFunction,Response } from 'express';
import { CustomRequest } from '../config/constants';

const roleCheckMiddleware = (roleToCheck: string) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        const role = req.payload?.role;
    if (role === roleToCheck) {
      next();
    } else {
        return res.status(401).json({ error: "Invalid role" });
    }
  };
};

export default roleCheckMiddleware;