import { pool } from "../db/pool";
import type { Users, AuthUser } from "../types/Users";
import type { OkPacket, RowDataPacket } from "mysql2";
import { error } from "../utils/manageError";

type PublicUser = Omit<Users, "password">;

/**
 * Creates a new user in the database.
 * @param userData - Object containing the user's name, email, and password.
 * @returns A promise that resolves to the created user object (without the password) including its ID.
 *          Throws an error if the user creation fails.
 */

export const userRegister = async (
  userData: Users
): Promise<PublicUser> => {
  const { name, email, password } = userData;
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  const values = [name, email, password];

  try {
    const [result] = await pool.query<OkPacket>(query, values);
    const id = result.insertId;

    if (!id) {
      throw error("Failed to register new user");
    }

    const newUser = { id, name, email };

    return newUser;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      throw error(err.message);
    } else {
      console.error("Unknown error", err);
      throw new Error("Unknown error occurred during user creation");

    }
  }
};

/**
 * Auth query - get user data.
 * @param userData - User data including only the email to search in the database.
 * @returns A promise that resolves a get request with data user, just his encripted password
 */
export const userAuth = async (
  userData: Pick<Users, "email">
): Promise<AuthUser> => {
  const { email } = userData;

  const query = "SELECT id, name, password FROM users WHERE email = ?";
  const values = [email];

  try {
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    if (rows.length === 0) {
     throw error("Failed to auth User: email not found");
    }

    const { password, id, name } = rows[0] as Pick<Users, "id" | "password" | "name">;

    if (!id) {
      throw error("Id is Missing");
    }

    return { hashed: password, id, name };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      throw error(err.message)
    } else {
      console.error("Unknown error", err);
      throw new Error("Unknown error occurred during user auth");
    }
  }
};
