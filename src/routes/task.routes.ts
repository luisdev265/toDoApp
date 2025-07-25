import { Router } from "express"
import { createNewTask, getAllTasks, updateTask, deleteTask } from "../controller/task.controller.js";
import { authWhitJWTCookie } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/tasks/register", authWhitJWTCookie, createNewTask);
router.get("/tasks/getAll/:userId", authWhitJWTCookie, getAllTasks);
router.put("/tasks/update/:id", authWhitJWTCookie, updateTask);
router.delete("/tasks/delete/:id", authWhitJWTCookie, deleteTask);

export default router;