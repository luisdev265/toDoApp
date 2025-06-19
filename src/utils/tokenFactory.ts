import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "un_secreto_super_seguro";

interface Payload {
  id: number;
  name: string;
  email: string;
}

// Función para generar un token
export function tokenFactory(payload: Payload): string {
  const token = jwt.sign(
    payload,
    secretKey,
    {
      expiresIn: "24h"  // El token expira en 1 hora (podés ajustar)
    }
  );
  return token;
}
