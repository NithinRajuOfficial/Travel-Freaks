import express from "express";
import {adminController} from '../controller/adminController'

const adminRoute = express.Router();

// Route to get the analytics data
adminRoute.get('/analyticsData',adminController.collectDailyAnalyticsData)

// Route to get all the users data
adminRoute.get('/getAllUsersData',adminController.fetchAllUsersData)

// Route to block or unblock users
adminRoute.put(`/userBlockOrUnblock/:userId`,adminController.blockOrUnblockUser)

export default adminRoute;
