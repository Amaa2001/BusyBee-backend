import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware som skyddar routes
// middleware funktion
export const protect = (req: any, res: Response, next: NextFunction) => {
  let token; // JWT token variabel som skickas från klienten i header

  // Kolla Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; //hämtar token

    try { // try-catch block för att hantera eventuella fel som kan upp
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secretkey"); // JWT verifiering. Kontrollerar att den är äkta, inte expired.

      // Sätt req.user korrekt
      req.user = { id: decoded.id }; // spara user id i requesten
      next();
    } catch (err) { 
      console.error("JWT error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};