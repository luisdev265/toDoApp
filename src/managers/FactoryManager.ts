import { TaskManager } from "./TaskManager.js";
import type { Users } from "../types/Users";
import { error } from "../utils/manageError.js";
import { UsersManager } from "./UsersManager.js";
import { GoogleAuthManager } from "./GoogleAuthManager.js";
import { idFactory } from "./idFactory.js";

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
    const id = this.createIdFactory().generateUserId();
    return new UsersManager(id);
  }

  /**
   * Handle creation of a new GoogleAuthManager.
   * @returns GoogleAuthManager.
   */
  createGoogleAuthManager(): GoogleAuthManager {
    const userManager = new UsersManager(undefined, "google");
    return new GoogleAuthManager(userManager);
  }

  /**
   * Handle creation of a new idFactory.
   * @returns idFactory.
   */
  private createIdFactory(): idFactory {
    return new idFactory;
  }
}