import express, { Application, Request, Response } from "express";
import { ErrorRequestHandler } from "express";
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

app.use(express.json());

// For storing user posts
app.use("/uploads", express.static("server_side/public/uploads"));
// Routes
// Admin Route
app.use("/api/admin", adminRoute);

// User Route
app.use("/api/user", userRoute);

// Auth Route
app.use("/api/auth", authRoute);

// Global error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Main App..ERROR:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
};

app.use(errorHandler);

// Server Starting
serverConfig(server);
