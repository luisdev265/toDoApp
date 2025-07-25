/**
 * Structure of each user registered in the app.
 * This interface is used in the userManager interface.
 */
export interface Users {
  /**
   * Identifier of the user.
   * Must be unique.
   */
  id?: number;

  /**
   * Name of the user.
   */
  name: string;

  /**
   * Email of the user.
   * Must be unique.
   */
  email: string;

  /**
   * Encrypted password of the user.
   * Passwords are encrypted using the bcrypt library.
   */
  password: string;
}

/**
 * Structure returned in a authUserQuery
 */
interface AuthUser {
  /**
   * Identifier of the user.
   * Must be unique.
   */
  id: number;

  /**
   * Name of the user.
   */
  name: string;

  /**
   * Encrypted password of the user.
   * Passwords are encrypted using the bcrypt library.
   */
  hashed: string;
}

export interface Payload {
  id: string | number;
  name: string;
  email: string;
}