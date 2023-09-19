import mongoose from "mongoose";
import { configKeys } from "./configKeys";

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(configKeys.MONGODB_URL);
    console.log(`Database Successfully Connected`);
  } catch (error) {
    console.log(`Database connection error ${error}`);
  }
};

export default connectDB;
