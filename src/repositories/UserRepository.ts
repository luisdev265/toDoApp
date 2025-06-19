import { pool } from "../db/pool";
import type { Users } from "../types/Users";
import type { OkPacket, RowDataPacket } from "mysql2";
import { error } from "../utils/manageError";

type PublicUser = Omit<Users, "password">;

/**
 * Creates a new user in the database.
 * @param userData - User data including name, email, and password.
 * @returns A promise that resolves to the created user (without password) with its ID, or undefined in case of failure.
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
): Promise<Pick<Users, "id" | "password"> | undefined> => {
  const { email } = userData;

  const query = "SELECT id, password FROM users WHERE email = ?";
  const values = [email];

  try {
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    if (rows.length === 0) {
      error("Failed to auth User: email not found");
    }

    const { password, id } = rows[0] as Pick<Users, "id" | "password">;
    return { password, id };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Unknown error", err);
      error("Unknown error occurred during user auth");
    }
  }
};
