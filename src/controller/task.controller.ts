import { FactoryManager } from "../managers/FactoryManager.js";
import type { Request, Response } from "express";

/**
 * Controller to create a new task for a user.
 *
 * Expects in the request body:
 * - userId: the ID of the user creating the task
 * - title: the title of the task
 * - description: the description of the task
 * - priority: the priority of the task
 * - status: the status of the task (e.g., "pending", "completed")
 *
 * Responds with:
 * - status(201) if task creation is successful
 * - status(400) if there is a client-side error
 * - status(500) if an unknown server error occurs
 *
 * @param req - Express request
 * @param res - Express response
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
 * Controller to retrieve all tasks for a specific user.
 *
 * Expects in the request body:
 * - userId: the ID of the user whose tasks are to be retrieved
 *
 * Responds with:
 * - status(201) if tasks are successfully retrieved
 * - status(400) if there is a client-side error
 * - status(500) if an unknown server error occurs
 *
 * @param req - Express request
 * @param res - Express response
 */
export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;
  const factory = new FactoryManager();
  const task = factory.createTaskManager(userId);

  try {
    const { success, message, data } = await task.getTasks();

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
