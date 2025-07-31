import { config } from "../config/config.js";
import { tokenFactory } from "../utils/tokenFactory.js";
import { error } from "../utils/manageError.js";

const clientID = config.googleCredential.clientId;
const clientSecret = config.googleCredential.clientSecret;
const redirectURI = config.googleCredential.redirectUri;
const frontendURL = config.frontendUrl;
const jwtSecret = config.jwtSecret;

/**
 * @class GoogleAuthManager
 * @description Manages Google OAuth 2.0 authentication flow.
 */
export class GoogleAuthManager {
  /**
   * @method getGoogleAuthUrl
   * @description Generates the Google OAuth 2.0 authentication URL.
   * @returns {string} The Google authentication URL.
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
   * @method googleCallbackLogic
   * @description Handles the callback logic after Google OAuth 2.0 authentication.
   * @param {string} code The authorization code received from Google.
   * @returns {Promise<{token: string, frontendURL: string}>} An object containing the generated JWT token and the frontend URL.
   * @throws {Error} If required environment variables for OAuth are missing or if authentication fails.
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

    console.log("Redirect URI que se está usando:", redirectURI);

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

    const user = await userRes.json();

    const token = await tokenFactory({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {token, frontendURL, id: user.id, name: user.name};
  }
}
