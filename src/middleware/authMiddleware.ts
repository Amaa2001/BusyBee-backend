import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

export const protect = (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string
      );

      req.user = { id: decoded.id };
      next();
    } catch (err) {
      console.error("JWT error:", err);
      return res.status(401).json({ message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({ message: "No token provided",
    });
  }
};