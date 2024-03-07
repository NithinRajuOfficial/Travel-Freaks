"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expressConfig_1 = __importDefault(require("./config/expressConfig"));
const http_1 = __importDefault(require("http"));
const databaseConfig_1 = __importDefault(require("./config/databaseConfig"));
const serverConfig_1 = __importDefault(require("./config/serverConfig"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// mongodb connection
(0, databaseConfig_1.default)();
// middleware express config
(0, expressConfig_1.default)(app);
app.use(express_1.default.json());
// For storing user posts
app.use("/uploads", express_1.default.static("server_side/public/uploads"));
// Routes
// Admin Route
app.use("/api/admin", adminRoute_1.default);
// User Route
app.use("/api/user", userRoute_1.default);
// Auth Route
app.use("/api/auth", authRoute_1.default);
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error("Main App..ERROR:", err.stack);
    res.status(500).json({ error: "Something went wrong" });
};
app.use(errorHandler);
// Server Starting
(0, serverConfig_1.default)(server);
