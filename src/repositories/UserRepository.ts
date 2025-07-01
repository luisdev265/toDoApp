import { pool } from "../db/pool.js";
import type { Users, AuthUser } from "../types/Users";
import type { OkPacket, RowDataPacket } from "mysql2";
import { error } from "../utils/manageError.js";

type PublicUser = Omit<Users, "password">;
type userRecord = Pick<Users, "id" | "password" | "name">;
type userId = Users["email" | "id"];

/**
 * Creates a new user in the database.
 *
 * @param userData - Object containing the user's name, email, and password.
 *
 * @returns A promise that resolves to the created user object (without the password) including its ID.
 *
 * @throws An error if the user creation fails.
 *
 */
export const userRegister = async (userData: Users): Promise<PublicUser> => {
  const { name, email, password } = userData;
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  const values = [name, email, password];

  try {
    const existingUser = await userExist(email);

    if (existingUser) {
      throw error("User already Exist");
    }

    const [result] = await pool.query<OkPacket>(query, values);
    const idNewUser = result.insertId;

    if (!idNewUser) {
      throw error("Failed to register new user");
    }

    const newUser = { id: idNewUser, name, email };

    return newUser;
  } catch (err) {
    if (err instanceof Error) {
      console.error("DB insert error:", err);
      throw error(err.message || "Unknown DB error during user creation");
    } else {
      console.error("Unknown error", err);
      throw error("Unknown error occurred during user creation");
    }
  }
};

/**
 * Auth query - get user data.
 *
 * @param userData - User data including only the email to search in the database.
 *
 * @returns A promise that resolves a get request with data user, just his encripted password.
 *
 * @throws An error if user don't exist.
 *
 */
export const userAuth = async (email: userId): Promise<AuthUser> => {
  try {

    if (!email) {
      throw error("Missing email")
    }

    const existingUser = await userExist(email);

    if (!existingUser) {
      throw error("User with this email already exists");
    }

    const { id, name, password } = existingUser;

    if (!id) {
      throw error("User not exist");
    }

    return { hashed: password, id, name };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      throw error(err.message);
    } else {
      console.error("Unknown error", err);
      throw new Error("Unknown error occurred during user auth");
    }
  }
};

/**
 * 
 * Verify if a user already exists.
 * 
 * @param identifier - Email (string) or id (number) received from frontend
 * 
 * @returns A promise with user info if exists, else null
 * 
 */
export const userExist = async (
  identifier: string | number
): Promise<userRecord | null> => {
  let query: string;

  if (typeof identifier === "number") {
    query = "SELECT id, name, password FROM users WHERE id = ?";
  } else if (typeof identifier === "string") {
    query = "SELECT id, name, password FROM users WHERE email = ?";
  } else {
    throw error("Invalid identifier type for userExist");
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, [identifier]);

  if (rows.length === 0) {
    return null;
  }

  const { id, name, password } = rows[0] as userRecord;
  return { id, name, password };
};
