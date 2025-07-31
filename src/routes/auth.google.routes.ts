import { googleAuth, googleCallback } from "../controller/authGoogle.controller.js";
import { Router } from "express";

/**
 * @file auth.google.routes.ts
 * @description Defines the Google authentication routes.
 */

const router = Router();

/**
 * @route GET /auth/google
 * @description Initiates the Google OAuth 2.0 authentication flow.
 */
router.get("/auth/google", googleAuth);

/**
 * @route GET /auth/google/callback
 * @description Handles the callback from Google OAuth 2.0, processes the authentication code, and redirects the user.
 */
router.get("/auth/google/callback", googleCallback);

export default router;
