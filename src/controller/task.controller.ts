import { FactoryManager } from "../managers/FactoryManager.js";
import type { Request, Response } from "express";
import { parseEnumQuery } from "../utils/parseEnums.js";

/**
 * Controller to create a new task for a specific user.
 *
 * Expects in `req.body`:
 * - userId: (required) The ID of the user creating the task.
 * - title: (required) The title of the new task.
 * - description: (optional) The description of the new task.
 * - priority: (optional) The priority of the new task ("low" | "medium" | "high").
 * - status: (optional) The status of the new task ("pending" | "completed").
 *
 * Responds with:
 * - HTTP 201 and JSON `{ success, message, data }` if the task is created successfully.
 * - HTTP 400 with error details if validation or known creation errors occur.
 * - HTTP 500 with error details if an unknown server error occurs.
 *
 * @param {Request} req - Express request object containing the task data in the body.
 * @param {Response} res - Express response object for sending status and JSON responses.
 *
 * @returns {Promise<void>} Resolves when the response is sent.
 *
 * @example
 * // POST /tasks
 * req.body = {
 *   userId: 1,
 *   title: "Estudiar patrones de diseño",
 *   description: "Repasar Factory y Observer",
 *   priority: "high",
 *   status: "pending"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Task created successfully",
 *   "data": {
 *     "id": 8,
 *     "title": "Estudiar patrones de diseño",
 *     "description": "Repasar Factory y Observer",
 *     "priority": "high",
 *     "status": "pending",
 *     "id_user": 1
 *   }
 * }
 */
export const createNewTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, ...resData } = req.body;
  const factory = new FactoryManager();
  const task = factory.createTaskManager(userId);

  const { title, description, priority, status } = resData;
  const taskData = { title, description, priority, status };

  try {
    const { success, message, data } = await task.createTask(taskData);

    res.status(201).json({ success, message, data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error in task creation",
        error: err.message || "Unknown error during creation",
      });
    } else {
      res.status(500).json({
        message: "Unknown error has occurred",
        error: String(err),
      });
    }
  }
};

/**
 * Controller to retrieve all tasks for a specific user with optional filtering by status and priority.
 *
 * Expects:
 * - `req.body.userId` (required): The ID of the user whose tasks are to be retrieved.
 * - `req.query.status` (optional): Status filter ("pending" | "completed").
 * - `req.query.priority` (optional): Priority filter ("low" | "medium" | "high").
 *
 * Responds with:
 * - HTTP 201 and JSON `{ success, message, data }` if tasks are retrieved successfully.
 * - HTTP 400 with error details if validation or known retrieval errors occur.
 * - HTTP 500 with error details if an unknown server error occurs.
 *
 * @param {Request} req - Express request object containing the user ID in the body and filters in the query.
 * @param {Response} res - Express response object for sending status and JSON responses.
 *
 * @returns {Promise<void>} Resolves when the response is sent.
 *
 * @example
 * // GET /tasks?status=pending&priority=high
 * req.body = { userId: 1 }
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Tasks retrieved successfully",
 *   "data": [
 *     {
 *       "id": 3,
 *       "title": "Tarea importante",
 *       "description": "Descripción de la tarea",
 *       "priority": "high",
 *       "status": "pending",
 *       "id_user": 1
 *     },
 *     ...
 *   ]
 * }
 */

export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;
  const { status: statusRaw, priority: priorityRaw } = req.query;

  const factory = new FactoryManager();
  const task = factory.createTaskManager(userId);

  const allowedPriorities = ["low", "medium", "high"] as const;
  const allowedStatuses = ["pending", "completed"] as const;

  const priority = parseEnumQuery(priorityRaw, allowedPriorities);
  const status = parseEnumQuery(statusRaw, allowedStatuses); 

  const filters = {
    ...(status && {status}),
    ...(priority && {priority})
  };

  try {
    const { success, message, data } = await task.getTasks(filters);

    res.status(201).json({ success, message, data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error in getting task",
        error: err.message || "Unknown error during creation",
      });
    } else {
      res.status(500).json({
        message: "Unknown error has occurred",
        error: String(err),
      });
    }
  }
};

/**
 * Controller to handle updating a task for a specific user.
 *
 * Expects the following in `req.body`:
 * - userId: (required) ID of the user who owns the task.
 * - id: (required) ID of the task to update.
 * - title: (optional) New title for the task.
 * - description: (optional) New description for the task.
 * - status: (optional) New status for the task.
 * - priority: (optional) New priority for the task.
 *
 * Responds with:
 * - HTTP 201 and JSON `{ success, message, data }` if the task is updated successfully.
 * - HTTP 400 with error details if validation or known update errors occur.
 * - HTTP 500 with error details if an unknown server error occurs.
 *
 * @param {Request} req - Express request containing the task data in the body.
 * @param {Response} res - Express response object for sending the status and JSON response.
 *
 * @example
 * // PUT /tasks/update
 * req.body = {
 *   userId: 1,
 *   id: 5,
 *   title: "Actualizar tarea",
 *   priority: "high"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Tasks gotten succssesfully",
 *   "data": {
 *     "id": 5,
 *     "userId": 1,
 *     "title": "Actualizar tarea",
 *     "priority": "high"
 *   }
 * }
 */
export const updateTask = async (req: Request, res: Response) => {
  const { userId, title, description, status, priority } = req.body;
  const { id } = req.params;
  const taskId = parseInt(id);
  const taskData = {title, description, status, priority, id: taskId};
  const factory = new FactoryManager;
  const task = factory.createTaskManager(userId);

  try {
     const { success, message, data } = await task.putTask(taskData);

    res.status(201).json({ success, message, data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error updating task",
        error: err.message || "Unknown error during updating",
      });
    } else {
      res.status(500).json({
        message: "Unknown error has occurred",
        error: String(err),
      });
    }
  }
}