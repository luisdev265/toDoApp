import { userRegister, userAuth } from "../controller/users.controller.js";
import { Router } from "express";

const router = Router();

router.post("/users/register", userRegister);
router.post("/users/auth", userAuth);

export default router;