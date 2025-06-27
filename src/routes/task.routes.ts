import { Router } from "express"
import { createNewTask } from "../controller/task.controller.js";

const router = Router();

router.post("/tasks/register", createNewTask);

export default router;