import { TaskManager } from "./TaskManager.js";
import type { Users } from "../types/Users";
import { error } from "../utils/manageError.js";
import { UsersManager } from "./UsersManager.js";

/**
 * Factory class to create new managers.
 */
export class FactoryManager {
    /**
     * Handle creation of a new task manager.
     * @param id - UserId.
     * @returns A new TaskManager
     * @throws An error if id is missing.
     */
  createTaskManager(id: Users["id"]): TaskManager {
    if (!id) {
      throw error("Missing user id");
    }

    return new TaskManager(id);
  }

  /**
   * Handle creation of a new user manager.
   * @returns UsersManager.
   */
  createUserManager(): UsersManager {
    return new UsersManager;
  }
}