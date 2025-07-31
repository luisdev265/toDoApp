import { Router } from "express";

/**
 * @file index.routes.ts
 * @description Defines the main application routes.
 */

const router = Router();

/**
 * @route GET /
 * @description Responds with a simple message to indicate the server is working.
 * @param {Request} _req The Express request object (unused).
 * @param {Response} res The Express response object.
 */
router.get("/", (_req, res) => {
  res.send("TypeScript con Express Working");
});

export default router;
