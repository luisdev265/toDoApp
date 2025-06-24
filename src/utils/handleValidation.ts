import type { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Express-validator middleware handler.
 *
 * @param req - Request object to check for validation errors.
 * @param res - Response object to send error messages if validation fails.
 * @param next - Function to pass control to the next middleware if no errors.
 */

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};
