import { Router } from "express";
import authController from "../../controllers/authController";

const router = Router();

router.post("/register", authController.register_post.bind(authController));

router.post("/login", authController.login_post.bind(authController));

router.put("/update", authController.forgot_password.bind(authController));

router.use((_req, res) => {
  res.status(404).json({ error: "Invalid API or Endpoint" });
});

export default router;
