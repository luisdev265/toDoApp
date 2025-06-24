import { userRegister, userAuth } from "../controller/users.controller.js";
import { Router } from "express";
import { validateAuth, validateRegister } from "../middlewares/validations/UserValidation.js";

const router = Router();

router.post("/users/register", validateRegister, userRegister);
router.post("/users/auth", validateAuth, userAuth);

export default router;