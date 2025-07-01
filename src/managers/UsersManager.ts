import { genericResponse } from "../types/genericResponses";
import { UserManager } from "../types/UserManager";
import { Users } from "../types/Users";
import { userRegister, userAuth } from "../repositories/UserRepository.js";
import { error } from "../utils/manageError.js";
import { tokenFactory } from "../utils/tokenFactory.js";
import { hashPassword, comparePassword } from "../utils/passHash.js";

/**
 * Class UserManager - Includes all business logic for basic user authentication.
 */
export class UsersManager implements UserManager {
  
  /**
   * Handles user registration with hashing and JWT generation for authentication.
   *
   * @param userData - Include all user data: name, email, password.
   *
   * This function performs:
   *  - Password hashing
   *  - Database registration
   *  - JWT generation
   *
   * @returns A promise that resolves with:
   * GenericResponse<{
   *     user: { id: number, name: string, email: string },
   *     token: string
   * }>
   *
   * @throws Error when any step in the user creation process fails.
   */
  async createUser(
    userData: Users
  ): Promise<
    genericResponse<{ user: Omit<Users, "password">; token: string }>
  > {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw error("All fields are required");
    }

    try {
      const hashedPassword = await hashPassword(password);

      const userPassHash = { ...userData, password: hashedPassword };

      const newUser = await userRegister(userPassHash);

      const { id } = newUser;

      if (!id) {
        throw error("Missing Id");
      }

      const payload = {
        id,
        name,
        email,
      };

      const token = tokenFactory(payload);

      return {
        success: true,
        message: "User created successfully",
        data: { user: newUser, token },
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Create user error:", err.message);
        throw error(err.message || "Unknown error during user creation");
      } else {
        console.error("Unknown error", err);
        throw new Error("Unknown error occurred during user creation");
      }
    }
  }

  /**
   * Handles user authentication by validating credentials and generating a JWT.
   *
   * @param userData - Basic user data for comparison: email and password in plain text.
   *
   * This function performs:
   *  - Validates user existence
   *  - Compares plain text password with hashed password
   *  - Generates JWT for authenticated session
   *
   * @returns A promise that resolves with:
   * GenericResponse<{
   *   token: string
   * }>
   *
   * @throws Error if fields are missing, credentials are invalid, or other authentication errors occur.
   */
  async validateUser(
    userData: Pick<Users, "email" | "password">
  ): Promise<genericResponse<{ token: string }>> {
    const { email, password } = userData;

    if (!email || !password) {
      throw error("All fields are required");
    }

    try {
      const { hashed, id, name } = await userAuth(email);

      const passwordMatch = await comparePassword(password, hashed);

      if (!passwordMatch) {
        throw error("Credentials are incorrect");
      }

      const payload = {
        id,
        name,
        email,
      };

      const token = tokenFactory(payload);

      return {
        success: true,
        message: "User authenticated successfully",
        data: { token },
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error validating user:", err);
        throw error(err.message);
      } else {
        console.error(err);
        throw new Error("Unknow error");
      }
    }
  }
}
