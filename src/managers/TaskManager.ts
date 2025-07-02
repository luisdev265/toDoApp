import type { Manager } from "../types/TaskManager";
import type { Task } from "../types/Tasks";
import type { genericResponse } from "../types/genericResponses";
import { createTask } from "../repositories/TaskRepository.js";
import { error } from "../utils/manageError.js";
import { getAllTaskUser } from "../repositories/TaskRepository.js";

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
}
