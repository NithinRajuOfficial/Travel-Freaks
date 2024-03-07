"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleCheckMiddleware = (roleToCheck) => {
    return (req, res, next) => {
        var _a;
        const role = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.role;
        if (role === roleToCheck) {
            next();
        }
        else {
            return res.status(401).json({ error: "Invalid role" });
        }
    };
};
exports.default = roleCheckMiddleware;
