import { Router } from "express"
import { createNewTask, getAllTasks } from "../controller/task.controller.js";

const router = Router();

router.post("/tasks/register", createNewTask);
router.get("/tasks/getAll", getAllTasks);

export default router;