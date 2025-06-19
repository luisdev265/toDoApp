import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.send("TypeScript con Express Working");
});

export default router;
