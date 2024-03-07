"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["admin"] = "admin";
    ROLE["user"] = "user";
})(ROLE || (exports.ROLE = ROLE = {}));
function generateOTP() {
    const length = 6;
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}
exports.generateOTP = generateOTP;
