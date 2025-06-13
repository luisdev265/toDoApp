export interface Task {
    title: string;
    description: string;
    priority: "baja" | "media" | "alta";
    state: "pending" | "completed";
}