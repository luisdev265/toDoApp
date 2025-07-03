import { Router } from "express"
import { createNewTask, getAllTasks, updateTask } from "../controller/task.controller.js";

const router = Router();

router.post("/tasks/register", createNewTask);
router.get("/tasks/getAll", getAllTasks);
router.put("/tasks/update/:id", updateTask);

export default router;