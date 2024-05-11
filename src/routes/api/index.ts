import express, {Response, Request} from 'express';
import users from './users/index';
import products from './products/index';

const router = express.Router();

router.use("/users", users);
router.use("/products", products);


router.use((_req: Request, res: Response) => {
    res.status(404).json({error: "Invalid API or Endpoint"})
})

export default router;