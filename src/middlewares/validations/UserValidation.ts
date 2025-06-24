import { body, ValidationChain } from "express-validator";
import { handleValidation } from "../../utils/handleValidation.js";
import { RequestHandler } from "express";

/**
 * Validate user data for Register
 */
const registerValidator: ValidationChain[] = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("email").isEmail().withMessage("Email must be valid"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const validateRegister: RequestHandler[] = [
  ...registerValidator,
  handleValidation,
];

/**
 * Validate user data for Auth
 */
const authValidator: ValidationChain[] = [
  body("email").isEmail().withMessage("Email must be valid"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const validateAuth: RequestHandler[] = [
    ...authValidator,
    handleValidation
]