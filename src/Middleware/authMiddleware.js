"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = require("config");
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    const jwtSecret = config.get("jwtSecret");
    try {
        const actualToken = token.split(" ")[1]; // Splitting by space and taking the second part
        const decoded = jsonwebtoken_1.default.verify(actualToken, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.default = authMiddleware;
