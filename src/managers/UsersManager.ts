import { genericResponse } from "../types/genericResponses";
import { UserManager } from "../types/UserManager";
import { Users } from "../types/Users";
import { userRegister, userAuth } from "../repositories/UserRepository.js";
import { error } from "../utils/manageError.js";
import { tokenFactory } from "../utils/tokenFactory.js";
import { hashPassword, comparePassword } from "../utils/passHash.js";

export class UsersManager implements UserManager {
  async createUser(
  userData: Users
): Promise<genericResponse<{ user: Omit<Users, "password">; token: string }>> {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw error("All fields are required");
  }

  try {

    const hashedPassword = await hashPassword(password);

    const userPassHash = {...userData, password: hashedPassword}

    const newUser = await userRegister(userPassHash);

    const { id } = newUser; 

    if (!id) {
      throw error("Missing Id");
    }

    const payload = {
      id, name, email
    }

    const token = tokenFactory(payload);

    return {
      success: true,
      message: "User created successfully",
      data: { user: newUser, token }
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

async validateUser(userData: Pick<Users, "email" | "password">): Promise<genericResponse<{ token?: string; }>> {
  const { email, password } = userData;
  
  if (!email || !password) {
    throw error("All fields are required");
  }

  try {
    const { hashed, id, name } = await userAuth({ email });

    const passwordMatach = await comparePassword(password, hashed);

    if (!passwordMatach) {
      throw error("Credentials are incorrect");
    }

    const payload = {
      id,
      name,
      email
    }

    const token = tokenFactory(payload);

    return {
      success: true,
      message: "Authentication Successfully",
      data: { token }
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
