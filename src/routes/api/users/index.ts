import express, { Request, Response } from "express";
import userController from "../../../controllers/userController";

const router = express.Router();

router.get("/:id", userController.getById.bind(userController));

router.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Invalid API or Endpoint" });
});

export default router;
