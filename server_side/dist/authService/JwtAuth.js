"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.verifyRefershToken = exports.generateRefreshToken = exports.generateAccessToken = exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configKeys_1 = require("../config/configKeys");
const generateJWT = (payload) => {
    if (configKeys_1.configKeys.JWT_SECRET_KEY) {
        return jsonwebtoken_1.default.sign({ unique_id: payload.id, role: payload.role }, configKeys_1.configKeys.JWT_SECRET_KEY, {
            expiresIn: configKeys_1.configKeys.JWT_EXPIRATION,
        });
    }
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    if (configKeys_1.configKeys.JWT_SECRET_KEY) {
        return jsonwebtoken_1.default.verify(token, configKeys_1.configKeys.JWT_SECRET_KEY);
    }
};
exports.verifyJWT = verifyJWT;
// Function to generate an access token
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, configKeys_1.configKeys.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    }); // Token expires in 15 minutes
};
exports.generateAccessToken = generateAccessToken;
// Function to generate a refresh token
const generateRefreshToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, configKeys_1.configKeys.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    }); // Token expires in 7 days
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefershToken = (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, configKeys_1.configKeys.REFRESH_TOKEN_SECRET);
        if (!decoded.userId || !decoded.role) {
            throw new Error("Invalid token payload");
        }
        // const userId = decoded.userId;
        return { userId: decoded.userId, role: decoded.role };
    }
    catch (error) {
        console.log(error, "this is the error");
        throw new Error("Refresh Token Verification Error");
    }
};
exports.verifyRefershToken = verifyRefershToken;
// Function to verify access token
const verifyAccessToken = (accessToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, configKeys_1.configKeys.ACCESS_TOKEN_SECRET);
        // const userId = decoded.userId;
        return {
            statusCode: 200,
            error: false,
            message: "successfully verified token",
            userId: decoded.userId,
            role: decoded.role
        };
    }
    catch (error) {
        console.log(error, "Verification of Access Token has failed");
        return {
            statusCode: 401,
            error: true,
            message: "Access token has been expired",
            userId: null,
            role: null,
        };
    }
};
exports.verifyAccessToken = verifyAccessToken;
