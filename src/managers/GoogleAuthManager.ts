import { config } from "../config/config.js";
import { error } from "../utils/manageError.js";
import type { Users } from "../types/Users.js";
import { UserManager } from "../types/UserManager.js";

const clientID = config.googleCredential.clientId;
const clientSecret = config.googleCredential.clientSecret;
const redirectURI = config.googleCredential.redirectUri;
const frontendURL = config.frontendUrl;
const jwtSecret = config.jwtSecret;

/**
 * GoogleAuthManager handles the OAuth 2.0 authentication flow with Google.
 *
 * It is responsible for:
 * - Generating the Google authentication URL
 * - Exchanging the authorization code for user info and access token
 * - Delegating user creation to the UserManager
 * - Returning a JWT and redirection data to the client
 */
export class GoogleAuthManager {
  private userManager: UserManager;

  /**
   * Constructs a new instance of GoogleAuthManager.
   *
   * @param userManager - An instance implementing the UserManager interface, used for user registration.
   */
  constructor(userManager: UserManager) {
    this.userManager = userManager;
  }

  /**
   * Generates the Google OAuth 2.0 authentication URL.
   *
   * @returns A URL string that redirects the user to Google's consent screen.
   *
   * @example
   * const url = authManager.getGoogleAuthUrl();
   * // Redirect the user to this URL
   */
  getGoogleAuthUrl() {
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&access_type=offline&prompt=consent`;
    return authUrl;
  }

  /**
   * Handles the callback logic after Google redirects the user back to your app.
   *
   * This method:
   * - Exchanges the authorization code for an access token
   * - Retrieves the user's profile information
   * - Registers the user using the UserManager
   * - Returns a JWT and frontend redirection data
   *
   * @param code - The authorization code received from Google's OAuth redirect.
   * @returns An object containing the user's JWT, frontend redirect URL, ID and name.
   *
   * @throws Error if any environment variables are missing or if any step in the flow fails.
   *
   * @example
   * const { token, frontendURL } = await authManager.googleCallbackLogic(code);
   * res.redirect(`${frontendURL}?token=${token}`);
   */
  async googleCallbackLogic(code: string) {
    if (
      !clientID ||
      !clientSecret ||
      !redirectURI ||
      !jwtSecret ||
      !frontendURL
    ) {
      throw error("Missing environment variables for OAuth");
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    const access_token = tokenData.access_token;

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const user: Omit<Users, "provider"> = await userRes.json();


    const { data } = await this.userManager.createUser({ ...user });

    const token = data?.token;

    return { token, frontendURL, id: user.id, name: user.name };
  }
}
