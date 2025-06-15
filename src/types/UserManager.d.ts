import type { Users } from "./Users";
import { genericResponse } from "./genericResponses";

export interface usersMagaer {
    createUser(userData: Users): Promise<genericResponse<Users>>
    validateUser(userData: Pick<Users, "email" | "password">): Promise<genericResponse<{ token: string }>>
}