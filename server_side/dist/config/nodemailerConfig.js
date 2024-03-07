"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADMIN_MAIL_ID,
        pass: process.env.ADMIN_MAIL_PASSWORD
    }
});
exports.default = transporter;
