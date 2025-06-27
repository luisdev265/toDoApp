import { TaskManager } from "../managers/TaskManager.js";
import type { Request, Response } from "express";

export const createNewTask = async (req: Request, res: Response): Promise<void> => {
    const { userId, ...resData } = req.body;
    const task = new TaskManager(userId);
    const { title, description, priority, status } = resData;
    const taskData = { title, description, priority, status }

    try {
        const { success, message, data } = await task.createTask(taskData);

        res.status(201).json({success, message, data});
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
}