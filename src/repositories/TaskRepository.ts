import type { OkPacket, RowDataPacket } from "mysql2";
import { error } from "../utils/manageError.js";
import type { Task } from "../types/Tasks";
import { pool } from "../db/pool.js";
import { userExist } from "./UserRepository.js";

/**
 *
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
  let status = rest.status;

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
    const existingUser = await userExist(userId);

    if (!existingUser) {
      throw error("User not Exist");
    }

    const [result] = await pool.query<OkPacket>(query, values);
    const idNewTask = result.insertId;

    if (!idNewTask) {
      throw error("Failed to register new task");
    }

    const newTask = {
      id: idNewTask,
      title,
      description,
      status,
      priority,
      userId,
    };

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

/**
 *
 * Get all tasks of an especific user.
 *
 * @param userData - Desestructuring just id of his data.
 *
 * @returns A promise that resolves a fetch selection of tasks in db.
 *
 * @throws an error if something fails during query execution.
 *
 */
export const getAllTaskUser = async (
  userId: Task["userId"]
): Promise<Task[]> => {
  const query =
    "SELECT id, title, description, priority, status, id_user FROM tasks WHERE id_user = ?";
  const values = [userId];

  try {
    const existingUser = await userExist(userId);

    if (!existingUser) {
      throw error("User not Exist");
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    if (rows.length === 0) {
      throw error("Not Tasks exist");
    }

    const tasks = rows as Task[];

    return tasks;
  } catch (err) {
    if (err instanceof Error) {
      console.error("DB insert error:", err);
      throw error(err.message || "Unknown DB error during getting tasks");
    } else {
      console.error("Unknown error", err);
      throw error("Unknown error occurred during getting tasks");
    }
  }
};
