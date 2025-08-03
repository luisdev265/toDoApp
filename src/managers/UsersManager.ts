import { genericResponse } from "../types/genericResponses";
import { UserManager } from "../types/UserManager";
import { Users } from "../types/Users";
import { userRegister, userAuth } from "../repositories/UserRepository.js";
import { error } from "../utils/manageError.js";
import { tokenFactory } from "../utils/tokenFactory.js";
import { hashPassword, comparePassword } from "../utils/passHash.js";

type providerConstructor = "google" | "local";
type idUserConstructor = number | undefined;

/**
 * UsersManager class encapsulates the business logic for user registration and authentication.
 * It supports multiple providers (e.g., "local", "google") and handles password hashing,
 * token generation, and error management.
 */
export class UsersManager implements UserManager {
  private idUser: idUserConstructor;
  private provider: providerConstructor;

  /**
   * Creates a new instance of UsersManager.
   *
   * @param id - Optional user ID (used mostly for local registrations).
   * @param provider - Authentication provider type, defaults to "local".
   */
  constructor(
    id: idUserConstructor = undefined,
    provider: providerConstructor = "local"
  ) {
    this.idUser = id;
    this.provider = provider;
  }

  /**
   * Registers a new user and returns a token for authentication.
   *
   * This method:
   * - Validates input fields
   * - Hashes the password if provider is "local"
   * - Stores the user in the database
   * - Generates a JWT for future authenticated requests
   *
   * @param userData - Object containing the user's name, email, and password.
   * @returns A promise resolving to an object with the user (excluding password) and a JWT token.
   *
   * @throws Error if any step fails during registration.
   */
  async createUser(
    userData: Omit<Users, "provider">
  ): Promise<
    genericResponse<{
      user: Omit<Users, "password" | "provider">;
      token: string;
    }>
  > {
    const { id: idUser, name, email, password } = userData;

    try {
      let hashedPassword: string | null = null;

      if (this.provider === "local") {
        if (!name || !email || !password) {
          throw error("All fields are required");
        }
        hashedPassword = await hashPassword(password);
      } else {
        if (!name || !email) {
          throw error("All fields are required");
        }
      }

      const userPassHash = {
        ...userData,
        password: hashedPassword,
        id: this.provider === "local" ? this.idUser : idUser,
        provider: this.provider,
      };

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
   * Authenticates a user based on email and password.
   *
   * This method:
   * - Fetches the user by email
   * - Compares the input password with the stored hashed password
   * - Generates and returns a JWT if valid
   *
   * @param userData - Object containing the user's email and plain text password.
   * @returns A promise resolving to a JWT token if authentication is successful.
   *
   * @throws Error if validation fails or credentials are incorrect.
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
