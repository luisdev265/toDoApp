import type { Manager } from "../types/TaskManager";
import type { Task } from "../types/Tasks";
import type { genericResponse } from "../types/genericResponses";
import {
  createTask,
  getAllTaskUser,
  updateTask,
  deleteTaskId,
} from "../repositories/TaskRepository.js";
import { error } from "../utils/manageError.js";

export class TaskManager implements Manager {
  private idUser: number;

  constructor(id: number) {
    this.idUser = id;
  }

  /**
   * Hnaldles Task creation by idUser.
   *
   * @param dataTask - Fields sended in frontend, Object Task except userId because we manage encapsulation.
   *
   * This function performs:
   *  - Fields required.
   *  - this.idUser exist.
   *  - Creation task in db.
   *
   * @returns A promise that resolves with:
   * GenericResponse<{
   *     newTask: { id, title, description, priority, status }
   * }>
   *
   * @throws Error if something went wrong in any step.
   *
   */
  async createTask(
    dataTask: Omit<Task, "userId">
  ): Promise<genericResponse<{ newTask: Task }>> {
    const { title, description } = dataTask;

    if (!title || !description) {
      throw error("All fields are required");
    }

    if (!this.idUser) {
      throw error("Error task creation proccess");
    }

    try {
      const newTask = await createTask({ userId: this.idUser, ...dataTask });

      return {
        success: true,
        message: "Task Creation Succssesfully",
        data: { newTask },
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("MySQL Error:", err.message);
        throw error("Error creating new task");
      }
      throw error("Unknown error has ocurred during task creation");
    }
  }

  /**
   * Handles get all task of a specific user.
   *
   * This function performs:
   *  - Fields required.
   *  - this.idUser exist.
   *  - Get all task refernces a specific user.
   *
   * @returns A promise that resolves with:
   * GenericResponse<{
   *     Task: [{ id, title, description, priority, status }]
   * }>
   *
   * @throws Error if something went wrong in any step.
   *
   */
  async getTasks(
    filters: Partial<Pick<Task, "priority" | "status">>
  ): Promise<genericResponse<Task[]>> {
    const userId = this.idUser;
    const { status, priority } = filters;

    if (!userId) {
      throw error("Error task creation proccess");
    }

    const taskData = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
    };

    try {
      const allTasks = await getAllTaskUser(taskData);

      return {
        success: true,
        message: "Tasks gotten succssesfully",
        data: allTasks,
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("MySQL Error:", err.message);
        throw error("Error getting tasks");
      }
      throw error("Unknown error has ocurred during task creation");
    }
  }

  /**
   * Updates a task for the current user with the provided fields.
   *
   * @param {Partial<Task>} taskData - An object containing the task fields to update:
   *   - id: (required) ID of the task to update.
   *   - title: (optional) New title for the task.
   *   - description: (optional) New description for the task.
   *   - status: (optional) New status for the task.
   *   - priority: (optional) New priority for the task.
   *
   * @returns {Promise<genericResponse<Partial<Task>>>} A promise that resolves with a genericResponse containing:
   *   - success: true if the task was updated successfully.
   *   - message: Confirmation message.
   *   - data: An object with the updated fields.
   *
   * @throws Will throw an error if:
   *   - The user is not identified (`userId` is missing).
   *   - No fields are provided for updating.
   *   - The task does not exist or does not belong to the user.
   *   - A database error occurs during the update.
   *
   * @example
   * const response = await taskManager.putTask({
   *   id: 12,
   *   title: "Revisar PR",
   *   priority: "high"
   * });
   * console.log(response);
   * // {
   * //   success: true,
   * //   message: "Tasks gotten succssesfully",
   * //   data: { id: 12, userId: 2, title: "Revisar PR", priority: "high" }
   * // }
   */
  async putTask(
    taskData: Partial<Task>
  ): Promise<genericResponse<Partial<Task>>> {
    const userId = this.idUser;
    const { title, description, status, priority, id: taskId } = taskData;

    if (!userId) {
      throw error("Error updating task");
    }

    if (!title && !description && !status && !priority && !taskId) {
      throw error("No field are provided");
    }

    try {
      const updatedTask = await updateTask({ userId, ...taskData });

      return {
        success: true,
        message: "Tasks updated succssesfully",
        data: updatedTask,
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("MySQL Error:", err.message);
        throw error("Error updating task");
      }
      throw error("Unknown error has ocurred during task updating");
    }
  }

  /**
   * Deletes a task for the current user.
   *
   * @param {Pick<Task, "id">} taskData - An object containing:
   *   - id: (required) The ID of the task to delete.
   *
   * @returns {Promise<genericResponse<Pick<Task, "id" | "userId">>>} A promise that resolves with a genericResponse containing:
   *   - success: true if the task was deleted successfully.
   *   - message: Confirmation message.
   *   - data: An object with the `id` of the deleted task and the `userId` of the user.
   *
   * @throws Will throw an error if:
   *   - The `id` or `userId` is missing.
   *   - The task does not exist or does not belong to the user.
   *   - A database error occurs during deletion.
   *
   * @example
   * const response = await taskManager.deleteTask({ id: 7 });
   * console.log(response);
   * // {
   * //   success: true,
   * //   message: "Tasks deleted succssesfully",
   * //   data: { id: 7, userId: 1 }
   * // }
   */
  async deleteTask(
    taskData: Pick<Task, "id">
  ): Promise<genericResponse<Pick<Task, "id" | "userId">>> {
    const { id } = taskData;
    const userId = this.idUser;

    if (!id || !userId) {
      throw error("Missing data");
    }

    try {
      await deleteTaskId({ id, userId });

      return {
        success: true,
        message: "Tasks deleted succssesfully",
        data: { id, userId },
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("MySQL Error:", err.message);
        throw error("Error deleting task");
      }
      throw error("Unknown error has ocurred during task deleting");
    }
  }
}
