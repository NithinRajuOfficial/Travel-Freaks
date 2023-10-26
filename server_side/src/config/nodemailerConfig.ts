const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: process.env.ADMIN_MAIL_ID,
        pass: process.env.ADMIN_MAIL_PASSWORD
    }
}) 


export default transporter;