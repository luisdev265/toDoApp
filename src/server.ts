import app from "./app.js";
import { config } from "./config/config.js";

const PORT: number = config.port;

/**
 * Starts the server on the specified port.
 * "0.0.0.0" binds the server to all network interfaces.
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`App corriendo en http://localhost:${PORT}`);
});
