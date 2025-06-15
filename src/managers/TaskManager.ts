import type { Gestor } from "../types/TaskManager";
import { Task } from "../types/Tareas";
import { pool } from "../db/pool";
import { OkPacket } from "mysql2";

export class TaskManager implements Gestor {
  private idUser: number;

  constructor(id: Gestor["idUser"]) {
    this.idUser = id;
  }

  async agregarTarea(task: Task): Promise<object> {
    const { title, description, priority, state } = task;

    const query =
      "INSERT into tasks (title, description, priority, state, idUser) values (?, ?, ?, ?, ?)";

    const values = [title, description, priority, state, this.idUser];

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
