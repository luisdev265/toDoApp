import { TaskManager } from "./TaskManager.js";
import type { Users } from "../types/Users";
import { error } from "../utils/manageError.js";
import { UsersManager } from "./UsersManager.js";
import { GoogleAuthManager } from "./GoogleAuthManager.js";
import { idFactory } from "./idFactory.js";

/**
 * FactoryManager is responsible for encapsulating the creation of instances
 * related to user management, task management, and authentication.
 */
export class FactoryManager {
  /**
   * Creates a new TaskManager instance for a specific user.
   *
   * @param id - The ID of the user for whom the TaskManager is created.
   * @returns A new TaskManager instance linked to the given user.
   * @throws Error if the user ID is missing.
   */
  createTaskManager(id: Users["id"]): TaskManager {
    if (!id) {
      throw error("Missing user id");
    }

    return new TaskManager(id);
  }

  /**
   * Creates a new UsersManager instance with an auto-generated ID.
   *
   * @returns A new UsersManager instance with a unique user ID.
   */
  createUserManager(): UsersManager {
    const id = this.createIdFactory().generateUserId();
    return new UsersManager(id, "local");
  }

  /**
   * Creates a new GoogleAuthManager instance using a UsersManager
   * initialized for Google as the provider.
   *
   * @returns A GoogleAuthManager instance ready for Google authentication.
   */
  createGoogleAuthManager(): GoogleAuthManager {
    const userManager = new UsersManager(undefined, "google");
    return new GoogleAuthManager(userManager);
  }

  /**
   * Creates a new instance of the ID generator (idFactory).
   *
   * @returns A new idFactory instance for generating unique identifiers.
   */
  private createIdFactory(): idFactory {
    return new idFactory();
  }
}
