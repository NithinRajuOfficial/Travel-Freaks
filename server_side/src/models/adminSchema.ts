import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshTokens: [
        {
          token: {
            type: String,
            required: true,
          },
          expires: {
            type: Date,
            required: true,
          },
        },
      ],
})

export const Admin = mongoose.model("Admin", adminSchema)