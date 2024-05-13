import express, { Request, Response } from "express";
import productController from "../../../controllers/productController";

const router = express.Router();

router.get("/pagination/:pagination", productController.get.bind(productController));

router.get("/name/:name", productController.getById.bind(productController));

router.get("/total", productController.total.bind(productController));

router.post("/", productController.create.bind(productController));

router.put("/:name", productController.update.bind(productController));

router.delete("/:name", productController.delete.bind(productController));


router.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Invalid API or Endpoint" });
});

export default router;
