import { userRegister, userAuth } from "../controller/users.controller.js";
import { Router } from "express";
import { validateAuth, validateRegister } from "../middlewares/validations/UserValidation.js";

/**
 * @file user.routes.ts
 * @description Defines the API routes for user registration and authentication.
 */

const router = Router();

/**
 * @route POST /users/register
 * @description Registers a new user. Validates input before calling the user registration controller.
 * @middleware validateRegister - Validates the user registration data.
 * @controller userRegister - Handles the user registration logic.
 */
router.post("/users/register", validateRegister, userRegister);

/**
 * @route POST /users/auth
 * @description Authenticates an existing user. Validates input before calling the user authentication controller.
 * @middleware validateAuth - Validates the user authentication data.
 * @controller userAuth - Handles the user authentication logic.
 */
router.post("/users/auth", validateAuth, userAuth);

export default router;