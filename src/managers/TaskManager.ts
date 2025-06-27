import type { Manager } from "../types/TaskManager";
import type { Task } from "../types/Tasks";
import type { genericResponse } from "../types/genericResponses";
import { createTask } from "../repositories/TaskRepository.js";
import { error } from "../utils/manageError.js";

export class TaskManager implements Manager{
  private idUser: number;

  constructor(id: number) {
    this.idUser = id;
  }

  async createTask(dataTask: Omit<Task, "userId">): Promise<genericResponse<{ newTask: Task }>> {
    const { title, description } = dataTask;

    if ( !title || !description ) {
      throw error("All fields are required");
    }

    if (!this.idUser) {
      throw error("Error task creation proccess");
    }

    try {

      const newTask = await createTask({userId: this.idUser, ...dataTask});
      
      return {
        success: true,
        message: "Task Creation Succssesfully",
        data: { newTask } 
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("MySQL Error:", err.message);
        return { success: false, message: err.message };
      }
      return { success: false, message: "Error desconocido" };
    }
  }
}
