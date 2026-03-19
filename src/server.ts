import express from "express";  
import cors from "cors";    
import helmet from "helmet"; 
import rateLimit from "express-rate-limit"; 
import dotenv from "dotenv"; 
import connectDB from "./config/db"; 
import authRoutes from "./routes/authRoutes"; 
import taskRoutes from "./routes/taskRoutes"; 

dotenv.config(); 
connectDB(); 

const app = express(); 

// Middleware
app.use(express.json()); 
app.use(helmet()); 
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); 

// Aktivera CORS för att tillåta frontend att prata med backend. Här tillåts endast localhost:5173 och localhost:5176 (där frontend körs).
app.use(cors({  
  origin: ["http://localhost:5173", "http://localhost:5176"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler 
// körs när ett fel kastas i appen.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


