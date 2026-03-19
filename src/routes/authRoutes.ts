import express from "express"; 
import { register, login } from "../controllers/authController"; 

const router = express.Router(); 

router.post("/register", register); // definierar en POST route på /register
router.post("/login", login); // " en POST route på /login

// Global Error handler 
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong", details: err.message }); 
});

export default router; 