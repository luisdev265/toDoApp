import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { error } from "console";

interface Payload {
  id: number;
  name: string;
  email: string;
}

// Token Generation Function
export function tokenFactory(payload: Payload): string {

  const secretKey = config.jwtSecret;

  if (!secretKey) {
    throw error("Error token generating");
  }

  const token = jwt.sign(
    payload,
    secretKey,
    {
      expiresIn: "24h"
    }
  );
  return token;
}
