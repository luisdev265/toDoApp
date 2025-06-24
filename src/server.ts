import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();

const PORT: number = parseInt(process.env.PORT || "4000");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App corriendo en http://localhost:${PORT}`);
});
