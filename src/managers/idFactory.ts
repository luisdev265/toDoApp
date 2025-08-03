import { customAlphabet } from "nanoid";

/**
 * idFactory is responsible for generating unique numeric user IDs.
 * 
 * It uses a custom NanoID alphabet restricted to digits (0-9) to ensure the
 * generated string can be parsed into an integer.
 */
export class idFactory {
   // Generates a 21-digit ID using only numeric characters (0-9)
  private nanoid = customAlphabet("1234567890", 21);

  /**
   * Generates a unique numeric ID for a user.
   *
   * @returns A unique user ID as a number.
   *
   * @example
   * const factory = new idFactory();
   * const userId = factory.generateUserId();
   * console.log(userId); // e.g. 928374650182736451092
   */
  public generateUserId() {
    return parseInt(this.nanoid());
  }
}
