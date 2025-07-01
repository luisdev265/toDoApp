import type { Response, Request } from "express";
import { FactoryManager } from "../managers/FactoryManager.js";

/**
 * Controller for user registration.
 *
 * Expects in the request body:
 * - name: the name of the user
 * - email: the email of the user
 * - password: the password for the user
 *
 * Responds with:
 * - status(201) if registration is successful
 * - status(400) if there is a client-side error
 * - status(500) if an unknown server error occurs
 *
 * @param req - Express request
 * @param res - Express response
 */
export const userRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  const factory = new FactoryManager();
  const user = factory.createUserManager();
  const { name, email, password } = req.body;
  const userData = { name, email, password };

  try {
    const { success, message, data } = await user.createUser(userData);

    res.status(201).json({
      success,
      message,
      data,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error in user Registration",
        error: err.message || "Unknown error during registration",
      });
    } else {
      res.status(500).json({
        message: "Unknown error has occurred",
        error: String(err),
      });
    }
  }
};

/**
 * Controller for user authentication (login).
 *
 * Expects in the request body:
 * - email: the email of the user
 * - password: the password of the user
 *
 * Responds with:
 * - status(200) if authentication is successful
 * - status(400) if there is a client-side error
 * - status(500) if an unknown server error occurs
 *
 * @param req - Express request
 * @param res - Express response
 */
export const userAuth = async (req: Request, res: Response) => {
  const factory = new FactoryManager();
  const user = factory.createUserManager();
  const { email, password } = req.body;
  const userData = { email, password };

  try {
    const { success, message, data } = await user.validateUser(userData);

    res.status(200).json({
      success,
      message,
      data
    })
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error in user auth",
        error: err.message || "Unknown error during auth",
      });
    } else {
      res.status(500).json({
        message: "Unknown error has occurred",
        error: String(err),
      });
    }
  }
}