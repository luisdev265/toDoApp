export interface Task {
    id?: number
    title: string
    description: string
    priority: "baja" | "media" | "alta"
    state: "pending" | "completed"
    readonly userId: number
}