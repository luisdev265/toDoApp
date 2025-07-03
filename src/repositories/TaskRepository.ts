import type { OkPacket, RowDataPacket, ResultSetHeader  } from "mysql2";
import { error } from "../utils/manageError.js";
import type { Task } from "../types/Tasks";
import { pool } from "../db/pool.js";
import { userExist } from "./UserRepository.js";

type getTaskFilter = Pick<Task, "userId"> &
  Partial<Pick<Task, "priority" | "status">>;

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
 * Retrieves all tasks for a specific user, with optional filtering by status and priority.
 *
 * @param {getTaskFilter} taskData - An object containing:
 *   - userId: The ID of the user whose tasks will be retrieved.
 *   - status (optional): The status to filter tasks by.
 *   - priority (optional): The priority to filter tasks by.
 *
 * @returns {Promise<Task[]>} A promise that resolves with an array of Task objects fetched from the database.
 *
 * @throws Will throw an error if:
 *   - The user does not exist.
 *   - No tasks are found for the user.
 *   - A database query error occurs during execution.
 *
 * @example
 * const tasks = await getAllTaskUser({
 *   userId: 1,
 *   status: "pending",
 *   priority: "high"
 * });
 * console.log(tasks);
 */
export const getAllTaskUser = async (taskData: getTaskFilter): Promise<Task[]> => {
  const { userId, status, priority } = taskData;

  let query =
    "SELECT id, title, description, priority, status, id_user FROM tasks WHERE id_user = ?";
  const values: [string | number] = [userId];

  if (status && priority) {
    query += " AND status = ? AND priority = ?";
    values.push(status as string, priority as string);
  } else if (status) {
    query += " AND status = ?";
    values.push(status as string);
  } else if (priority) {
    query += " AND priority = ?";
    values.push(priority as string);
  }

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

/**
 * Updates a task in the database with the provided partial fields.
 *
 * @param {Partial<Task>} taskData - An object containing the fields to update:
 *   - id: (required) ID of the task to update.
 *   - userId: (required) ID of the user who owns the task.
 *   - title: (optional) New title for the task.
 *   - description: (optional) New description for the task.
 *   - status: (optional) New status for the task.
 *   - priority: (optional) New priority for the task.
 *
 * @returns {Promise<Partial<Task>>} A promise that resolves with an object containing the updated fields.
 *
 * @throws Will throw an error if:
 *   - No fields are provided to update.
 *   - Required fields (`id` or `userId`) are missing.
 *   - The task is not found or does not belong to the user.
 *   - A database error occurs during the update.
 *
 * @example
 * const updatedTask = await updateTask({
 *   id: 5,
 *   userId: 2,
 *   title: "New title",
 *   priority: "high"
 * });
 * console.log(updatedTask);
 * // Output:
 * // {
 * //   id: 5,
 * //   userId: 2,
 * //   title: "New title",
 * //   priority: "high"
 * // }
 */

export const updateTask = async (taskData: Partial<Task>): Promise<Partial<Task>> => {
  const { title, description, status, priority, id, userId } = taskData;

  let query = "UPDATE tasks SET ";
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (title) {
  updates.push("title = ?");
  values.push(title);
  }
  if (description) {
    updates.push("description = ?");
    values.push(description);
  }
  if (priority) {
    updates.push("priority = ?");
    values.push(priority);
  }
  if (status) {
    updates.push("status = ?");
    values.push(status);
  }

  if (updates.length === 0) {
    throw error("No fields provided to update");
  }

  if (!id || !userId) {
    throw error("Missing fields");
  }

  query += updates.join(", ") + " WHERE id = ? AND id_user = ?";
  values.push(id, userId);

  try {
    const [result] = await pool.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw error("Task not found or user does not own this task");
    }

    const updatedTask = {
      ...(id && {id}),
      ...(title && {title}),
      ...(description && {description}),
      ...(status && {status}),
      ...(priority && {priority}),
      ...(userId && {userId}),
    };

    return updatedTask

  } catch (err) {
    if (err instanceof Error) {
      console.error("DB update error:", err);
      throw error(err.message || "Unknown DB error during updating task");
    } else {
      console.error("Unknown error", err);
      throw error("Unknown error occurred during updating task");
    }
  }
}