import app from "./app.js";

const PORT: number = parseInt(process.env.PORT || "4000");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App corriendo en http://localhost:${PORT}`);
});
