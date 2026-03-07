import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Funktion för att generera JWT
const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string || "secretkey", {
    expiresIn: "7d"
  });

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Kontrollera om användare redan finns
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User exists" });
    }

    // Hasha lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa ny användare
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Skicka svar + token
    res.status(201).json({
      message: "User created",
      token: generateToken(user.id)
    });

  } catch (error) {
    // Logga felet i terminalen
    console.error("Register error:", error);

    // Skicka tillbaka detaljer till Postman
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

    // Generera token
    const token = generateToken(user.id);

    res.json({
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error instanceof Error ? error.message : error
    });
  }
};