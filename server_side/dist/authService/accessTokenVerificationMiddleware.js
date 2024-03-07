"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessTokenMiddleware = void 0;
const JwtAuth_1 = require("./JwtAuth");
const verifyAccessTokenMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }
        const accessToken = authorizationHeader.split(" ")[1];
        const payload = (0, JwtAuth_1.verifyAccessToken)(accessToken);
        if (payload.statusCode === 401) {
            return res.status(401).json({ error: "Invalid access token" });
        }
        req.payload = payload;
        next();
        // Set userId in a custom response header
        // res.set("X-UserId", userId);
    }
    catch (error) {
        res.status(401).json({ error: "Invalid access token" });
    }
};
exports.verifyAccessTokenMiddleware = verifyAccessTokenMiddleware;
