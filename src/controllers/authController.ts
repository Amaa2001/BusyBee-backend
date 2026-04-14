import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

//  ACCESS TOKEN
const generateAccessToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

// REFRESH TOKEN
const generateRefreshToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};


// REGISTER
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets missing in .env");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created",
      token: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id) 
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : error
    });
  }
};


// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      token: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id) 
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed",
      details: error instanceof Error ? error.message : error
    });
  }
};


// REFRESH TOKEN 
export const refreshToken = (req: Request, res: Response) => {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ token: newAccessToken });

  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};