import { Task } from "./Tareas";
import { genericResponse } from "./genericResponses";

/**
 * Interface implemented by the TaskManager class.
 * Used to manage tasks for a specific user.
 */
export interface Manager {
  /**
   * The ID of the user associated with this task manager.
   */
  idUser: number;

  /**
   * Creates a new task.
   * @param task - Information about the task to create.
   * @returns A promise resolving to the created task wrapped in a generic API response.
   */
  createTask(task: Task): Promise<genericResponse<Task>>;

  /**
   * Retrieves all tasks associated with a specific user.
   * @param idUser - ID of the user whose tasks are to be fetched.
   * @returns A promise resolving to a list of tasks wrapped in a generic API response.
   */
  getTasks(idUser: Task["userId"]): Promise<genericResponse<Task[]>>;

  /**
   * Updates an existing task.
   * @param idTask - Unique ID of the task to update.
   * @param tarea - Partial information with the fields to update.
   * @returns A promise resolving to the updated task data wrapped in a generic API response.
   */
  putTask(
    idTask: number,
    tarea: Partial<Task>
  ): Promise<genericResponse<Partial<Task>>>;

  /**
   * Deletes a task.
   * @param idTask - Unique ID of the task to delete.
   * @returns A promise resolving to a generic API response indicating the result of the operation.
   */
  deleteTask(idTask: number): Promise<genericResponse>;

  /**
   * Retrieves tasks filtered by priority ("low", "medium", or "high").
   * @param priority - Priority to filter tasks by.
   * @returns A promise resolving to a list of tasks with the specified priority, wrapped in a generic API response.
   */
  filterPriorityTask(
    priority: Task["priority"]
  ): Promise<genericResponse<Task[]>>;

  /**
   * Retrieves tasks filtered by status ("pending" or "completed").
   * @param status - Status to filter tasks by.
   * @returns A promise resolving to a list of tasks with the specified status, wrapped in a generic API response.
   */
  filterStatusTask(status: Task["status"]): Promise<genericResponse<Task[]>>;
}
