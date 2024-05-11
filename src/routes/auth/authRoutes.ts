import { Router } from "express";
import authController from "../../controllers/authController";

const router = Router();


router.post("/register", authController.register_post.bind(authController));

router.post("/login", authController.login_post.bind(authController));

export default router;