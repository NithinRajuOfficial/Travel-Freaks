import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const expressConfig = (app: Application) => {
  // Enabling CORS

  const enableCors = {
    origin: "*",
    exposeHeaders: [
      "Cros-Origin-Opener-Policy",
      "Cross-Origin-Resource-Policy",
    ],
  };

  // Configuring Express Middlewares
  app.use(cors(enableCors));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

export default expressConfig;



