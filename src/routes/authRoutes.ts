import express from "express"; 
import { register, login, refreshToken } from "../controllers/authController"; 

const router = express.Router(); 
//  den gör det möjligt att organisera routes i separata filer och exportera dem till server.ts

router.post("/register", register); 
router.post("/login", login); 
router.post("/refresh", refreshToken); 

// Global Error handler 
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack); // loggar felet i serverns konsol för debugging
  res.status(500).json({ error: "Something went wrong", details: err.message }); 
});

export default router; // gör routern tillgänglig för import i andra filer som server.ts

// routes definierar vilka endpoints som finns i API:et 
// två endpoints: /register och /login, som båda är POST requests. När en klient skickar en request till dessa endpoints, kommer respektive funktion (register eller login) att köras för att hantera autentiseringen.