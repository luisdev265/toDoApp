import { Task } from "./Tareas";
import { genericResponse } from "./genericResponses";

export interface Gestor {
    idUser: number;
    agregarTarea(task: Task): Promise<genericResponse>;
    leerTareas(): Promise<genericResponse<Task[]>>;
    modificarTarea(idTask: number, tarea: Partial<Task>): Promise<genericResponse>;
    deleteTask(idTask: number): Promise<genericResponse>;
    filterPriorityTask(priority: Task["priority"]): Promise<genericResponse<Task[]>>;
    filterStateTask(state: Task["state"]): Promise<genericResponse<Task[]>>;
}