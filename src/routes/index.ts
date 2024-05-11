import express, { Request, Response } from 'express';
import api from './api/index';
import auth from './auth/authRoutes';
import authMiddleware from '../middleware/authMiddleware';


const router = express.Router();

router.use("/api", authMiddleware , api);
router.use("/auth", auth);

router.use((_req: Request, res:Response) => {
    res.status(404).json({error: "Invalid API or Endpoint"})
})

export default router;