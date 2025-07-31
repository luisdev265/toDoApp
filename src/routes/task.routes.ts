import { Router } from "express"
import { createNewTask, getAllTasks, updateTask, deleteTask } from "../controller/task.controller.js";
import { authWhitJWTCookie } from "../middlewares/auth.middleware.js";

/**
 * @file task.routes.ts
 * @description Defines the API routes for task management.
 */

const router = Router();

/**
 * @route POST /tasks/register
 * @description Registers a new task. Requires JWT authentication.
 * @middleware authWhitJWTCookie - Authenticates the user using a JWT cookie.
 * @controller createNewTask - Handles the creation of a new task.
 */
router.post("/tasks/register", authWhitJWTCookie, createNewTask);

/**
 * @route GET /tasks/getAll/:userId
 * @description Retrieves all tasks for a specific user. Requires JWT authentication.
 * @middleware authWhitJWTCookie - Authenticates the user using a JWT cookie.
 * @controller getAllTasks - Handles the retrieval of all tasks for a user.
 */
router.get("/tasks/getAll/:userId", authWhitJWTCookie, getAllTasks);

/**
 * @route PUT /tasks/update/:id
 * @description Updates an existing task by its ID. Requires JWT authentication.
 * @middleware authWhitJWTCookie - Authenticates the user using a JWT cookie.
 * @controller updateTask - Handles the update of a task.
 */
router.put("/tasks/update/:id", authWhitJWTCookie, updateTask);

/**
 * @route DELETE /tasks/delete/:id
 * @description Deletes a task by its ID. Requires JWT authentication.
 * @middleware authWhitJWTCookie - Authenticates the user using a JWT cookie.
 * @controller deleteTask - Handles the deletion of a task.
 */
router.delete("/tasks/delete/:id", authWhitJWTCookie, deleteTask);

export default router;