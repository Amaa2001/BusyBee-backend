import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // your User model
import asyncHandler from "express-async-handler";

// Middleware som skyddar routes
export const protect = (req: any, res: Response, next: NextFunction) => {
  let token;

  // Kolla Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

      // Sätt req.user korrekt
      req.user = { id: decoded.id };
      next();
    } catch (err) {
      console.error("JWT error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};