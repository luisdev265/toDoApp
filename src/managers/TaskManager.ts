import type { Manager } from "../types/TaskManager";
import { Task } from "../types/Tareas";
import { pool } from "../db/pool";
import { OkPacket } from "mysql2";
import { genericResponse } from "../types/genericResponses";

export class TaskManager implements Manager {
  private idUser: number;

  constructor(id: Manager["idUser"]) {
    this.idUser = id;
  }

  async createTask(task: Task): Promise<genericResponse<Task>> {
    const { title, description, priority, status } = task;

    const query =
      "INSERT into tasks (title, description, priority, state, idUser) values (?, ?, ?, ?, ?)";

    const values = [title, description, priority, status, this.idUser];

    try {
      const [result] = await pool.query<OkPacket>(query, values);

      if (!result.insertId) {
        throw new Error("Error Creating new Task");
      }

      return { result };
    } catch (err) {
      if (err instanceof Error) {
        console.error("MySQL Error:", err.message);
        return { success: false, message: err.message };
      }
      return { success: false, message: "Error desconocido" };
    }
  }
}
