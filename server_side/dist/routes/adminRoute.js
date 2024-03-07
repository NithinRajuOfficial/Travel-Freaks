"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const adminRoute = express_1.default.Router();
// Route to get the analytics data
adminRoute.get('/analyticsData', adminController_1.adminController.collectDailyAnalyticsData);
// Route to get all the users data
adminRoute.get('/getAllUsersData', adminController_1.adminController.fetchAllUsersData);
// Route to block or unblock users
adminRoute.put(`/userBlockOrUnblock/:userId`, adminController_1.adminController.blockOrUnblockUser);
exports.default = adminRoute;
