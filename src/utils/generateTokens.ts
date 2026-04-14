import jwt from "jsonwebtoken"; // "" jsonwebtoken biblioteket som används för att skapa och verifiera JWT tokens

export const generateAccessToken = (userId: string) => {  // har skapas en funktion ( genetateAccessToken)
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { // har skapas själva JWT token (payload, signature, secreet key)
    expiresIn: "15m"
  });
};

// generarar en refresh token
export const generateRefreshToken = (userId: string) => { 
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { 
    expiresIn: "7d"
  });
};



