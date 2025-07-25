import Jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/config.js";
import type { JwtPayload } from "jsonwebtoken";
import type { Payload } from "../types/Users";

interface decodedUser extends Payload, JwtPayload{}

/**
 * Middleware that validates JWT token from cookies.
 * 
 * This middleware extracts and validates a JWT token from the 'authToken' cookie.
 * It verifies the token signature and checks for expiration. If validation passes,
 * the decoded user information is attached to the request object for use in subsequent middleware.
 * 
 * Throws 401 when:
 * - No auth token is provided
 * - Token is invalid or expired
 * 
 * Throws 500 when:
 * - JWT secret is missing
 * - Unexpected server error occurs
 * 
 * @example
 * app.get('/protected', validateJWTCookie, (req, res) => {
 *   res.json({ user: req.user });
 * });
 */
export const authWhitJWTCookie = (req: Request, res: Response, next: NextFunction): void => {
    const secret = config.jwtSecret;
    if (!secret) {
        return void res.status(500).json({
        error: "Missing secret",
        message: "Secret hasn't been provided",
      });
    }
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return void res.status(401).json({
        error: "No auth token provided",
        message: "Token de autenticación requerido",
      });
    }

    const decoded = Jwt.verify(token, secret) as decodedUser;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return void res.status(401).json({
        error: "Token expired",
        message: "Token expired",
      });
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JsonWebTokenError") {
        return void res.status(401).json({
          error: "Invalid token",
          message: "Invalid Token",
        });
      }

      if (error.name === "TokenExpiredError") {
        return void res.status(401).json({
          error: "Token expired",
          message: "Token expired",
        });
      }
    } else {
      return void res.status(500).json({
        error: "Server error",
        message: "Internal server error",
      });
    }
  }
};
