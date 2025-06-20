import bcrypt from "bcrypt";

/**
 * Represents how many rounds bcrypt will use to hash your password.
 * The more salt rounds you use, the more secure the password hash will be.
 * However, the process will also be slower.
 *
 * Recommended: 10 salt rounds for most applications.
 */
const saltRounds = 10;

/**
 * Encrypts a password.
 * @param password - The user's plain text password.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The user's plain text password input.
 * @param hashed - The hashed password stored in the database.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}
