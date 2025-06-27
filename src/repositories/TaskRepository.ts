import type { OkPacket } from "mysql2";
import { error } from "../utils/manageError.js";
import type { Task } from "../types/Tasks";
import { pool } from "../db/pool.js";


/**
 * Create task query function.
 * 
 * @param taskData - Object containing the title, description, priority, status and userId.
 * 
 * @returns A promise that resolves a new task register in db.
 * 
 * @throws An error if the user creation fails.
 * 
 */
export const createTask = async (taskData: Task): Promise<Task> => {
  const { title, description, userId, ...rest } = taskData;

  let priority = rest.priority;
  let status = rest.status

  if (!rest.priority) {
    priority = "low";
  }

  if (!rest.status) {
    status = "pending";
  }

  const query =
    "INSERT INTO tasks (title, description, status, priority, id_user) VALUES (?, ?, ?, ?, ?)";
  const values = [title, description, status, priority, userId];

  try {
    const [result] = await pool.query<OkPacket>(query, values);
    const idNewTask = result.insertId;

    if (!idNewTask) {
      throw error("Failed to register new task");
    }

    const newTask = { id: idNewTask ,title, description, status, priority, userId };

    return newTask;
  } catch (err) {
    if (err instanceof Error) {
      console.error("DB insert error:", err);
      throw error(err.message || "Unknown DB error during task creation");
    } else {
      console.error("Unknown error", err);
      throw error("Unknown error occurred during task creation");
    }
  }
};