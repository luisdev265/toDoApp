import { UsersManager } from "../managers/UsersManager.js";
import type { Response, Request } from "express";

export const userRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = new UsersManager();
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

export const userAuth = async (req: Request, res: Response) => {
  const user = new UsersManager();
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