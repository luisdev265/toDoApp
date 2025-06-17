/**
 * Structure of each task that will be managed in this project
 */

export interface Task {
    /** 
     * Id of each task: Number.
     * This is his unique identifire.
     * Can't be repeated.
    */
    id?: number
    /** 
     * Title of each task: string.
    */
    title: string
    /**
     * Description of each task: string.
     * Here people can put somes characteristics about task.
    */
    description: string
    /**
     * Priority of the task: Maybe can be low, medium or high.
    */
    priority: "low" | "medium" | "high"
    /**
     * Status of the task: alredy completed or not?.
     * Represented by: pending or completed .
    */
    status: "pending" | "completed"
    /**
     * A readOnly variable.
     * Used to know what task is propiety of what user.
     * It can't have id's inexisting.
     * Each user cant just have a unique id. 
    */
    readonly userId: number
}