import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import indexRouter from "./routes/index.routes.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import limiter from "./middlewares/rateLimiter.middleware.js";
import googleRouter from "./routes/auth.google.routes.js";

const app = express();

/**
 * Basic Security Api Config
 */
app.use(helmet());
app.disable("x-powered-by");

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

app.use(limiter);

/**
 * Global Use Middlewares
 */
app.use(express.json());

app.use(cookieParser());

/**
 * Routes
 */
app.use("/", indexRouter);
app.use("/api", userRouter);
app.use("/api", taskRouter);
app.use("/api", googleRouter);

/**
 * 404 Handler
 */
app.use((_req, res) => {
  res.status(404).send("Opps!, Someting went wrong. Error 404 Page not found.");
});

export default app;
