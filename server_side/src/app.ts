import express, { Application, Request, Response } from "express";
import expressConfig from "./config/expressConfig";
import http from "http";
import connectDB from "./config/databaseConfig";
import serverConfig from "./config/serverConfig";
import adminRoute from "./routes/adminRoute";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";

const app: Application = express();
const server = http.createServer(app);

// mongodb connection
connectDB();

// middleware express config
expressConfig(app);

// For storing user posts
app.use("/uploads", express.static("server_side/public/uploads"));
// Routes
// Admin Route
app.use("/api/admin", adminRoute);

// User Route
app.use("/api/user", userRoute);

// Auth Route
app.use("/api/auth", authRoute);


// Server Starting
serverConfig(server);
