import { pool } from "../db/pool.js";
import type { Users, AuthUser } from "../types/Users";
import type { OkPacket, RowDataPacket } from "mysql2";
import { error } from "../utils/manageError.js";

type PublicUser = Omit<Users, "password">;
type userRecord = Pick<Users, "id" | "password" | "name">;
type userEmail = Pick<Users, "email">;

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
    const existingUser = await userExist({ email });

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
export const userAuth = async (userData: userEmail): Promise<AuthUser> => {
  const { email } = userData;

  try {
    const existingUser = await userExist({ email });

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
 * Verify if a user already exist or not.
 * @param email - Email recived in fronted reques
 * @returns A promise that resolves if user exist or not inside database returned his info if its correct
 */
const userExist = async (
  userData: userEmail
): Promise<userRecord | null> => {
  const { email } = userData;
  const query = "SELECT id, name, password FROM users WHERE email = ?";
  const values = [email];

  const [rows] = await pool.query<RowDataPacket[]>(query, values);

  if (rows.length === 0) {
    return null;
  }

  const { id, name, password } = rows[0] as userRecord;

  return { id, name, password };
};
