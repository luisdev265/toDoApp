import { Request, Response } from "express";
import { FactoryManager } from "../managers/FactoryManager.js";

/**
 * @function googleAuth
 * @description Redirects the user to the Google authentication URL.
 * @param {Request} _req The Express request object (unused).
 * @param {Response} res The Express response object.
 */
export const googleAuth = (_req: Request, res: Response) => {
  const factoryManager = new FactoryManager();
  const googleAuthManager = factoryManager.createGoogleAuthManager();
  const authUrl = googleAuthManager.getGoogleAuthUrl();

  res.redirect(authUrl);
};

/**
 * @function googleCallback
 * @description Handles the Google OAuth 2.0 callback, exchanges the authorization code for a token, and redirects the user.
 * @param {Request} req The Express request object, containing the authorization code in `req.query.code`.
 * @param {Response} res The Express response object.
 */
export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {

    const factoryManager = new FactoryManager();
    const googleAuthManager = factoryManager.createGoogleAuthManager();
    const {token, frontendURL, id, name} = await googleAuthManager.googleCallbackLogic(code);


    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    res.cookie("userId", id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    res.cookie("name", name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    res.redirect(frontendURL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error authenticating with Google");
  }
};
