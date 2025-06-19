import type { Users } from "./Users";
import { genericResponse } from "./genericResponses";

/**
 * Interface implemented by the UserManager class.
 * Provides basic functions for user authentication.
 */
export interface UserManager {
  /**
   * Registers a new user.
   * @param userData - Data submitted in the user registration form.
   * @returns A promise that resolves to a generic API response containing the registered user and a JWT token.
   */
  createUser(userData: Users): Promise<genericResponse<{user: Omit<Users, "password">, token: string} | undefined>>;

  /**
   * Validates user credentials and logs in the user.
   * @param userData - Data submitted in the login form (email and password).
   * @returns A promise that resolves to a generic API response containing a JWT token if successful; otherwise, a failure response.
   */
  validateUser(userData: Pick<Users, "email" | "password">): Promise<genericResponse<{ token?: string }>>;
}
