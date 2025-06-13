import { Task } from "./Tareas";

export interface Gestor {
    idUser: number;
    agregarTarea(task: Task): object;
    leerTareas(): Task[];
    modificarTarea(idTask: number, tarea: Partial<Task>): Promise<object>;
    deleteTask(idTask: number): object;
    filterPriorityTask(priority: Task["priority"]): Task[];
    filterStateTask(state: Task["state"]): Task[];
}