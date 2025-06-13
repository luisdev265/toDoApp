import express from "express"
import dotenv from "dotenv"
import cors from "cors"

cors();
dotenv.config();

const app = express();

app.use("/", (_req, res) => {
    res.send("TypesScript con express Working");
})

const PORT: number = parseInt(process.env.PORT || "4000");

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App corriendo en http://localhost:${PORT}`);
});