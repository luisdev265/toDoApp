import { genericResponse } from "../types/genericResponses";
import { UserManager } from "../types/UserManager";
import { Users } from "../types/Users";
import { userRegister, userAuth } from "../repositories/UserRepository";
import { error } from "../utils/manageError";
import { tokenFactory } from "../utils/tokenFactory";

export class UsersManager implements UserManager {
  async createUser(
  userData: Users
): Promise<genericResponse<{ user: Omit<Users, "password">; token: string }>> {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    error("All fields are required");
  }

  try {
    const newUser = await userRegister(userData);

    const {id, name, email} = newUser; 

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
      console.error(err.message);
      throw error(err.message);
    } else {
      console.error("Unknown error", err);
      throw new Error("Unknown error occurred during user creation");
    }
  }
}

validateUser(userData: Pick<Users, "email" | "password">): Promise<genericResponse<{ token?: string; }>> {
    
}
  
}
