import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const config = require("config");

interface UserPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const jwtSecret = config.get("jwtSecret");
  try {
    const actualToken = token.split(" ")[1]; // Splitting by space and taking the second part
    const decoded = jwt.verify(actualToken, jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
