import { Request, Response } from "express";
import prisma from "../../lib/prisma";

class productController {
  async get(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
    }
  }

  async getById(req: Request, res: Response) {
    const { name } = req.params;
    try {
      const product = await prisma.product.findUnique({
        where: {
          handle: name,
        },
      });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: "Error fetching product" });
    }
  }

  async create(req: Request, res: Response) {
    const {
      name,
      price,
      sku,
      grams,
      stock,
      compare_price,
      barcode,
      description,
    } = req.body;
    const title = name.split("-").join(" ").toUpperCase();
    try {
      const product = await prisma.product.create({
        data: {
          handle: name,
          title,
          price,
          sku,
          grams,
          stock,
          compare_price,
          barcode,
          description,
        },
      });
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: "Error creating product" });
    }
  }

  async update(req: Request, res: Response) {
    const { name } = req.params;
    const { price, sku, grams, stock, compare_price, barcode, description } =
      req.body;
    const title = name.split("-").join(" ").toUpperCase();
    try {
      const product = await prisma.product.update({
        where: {
          handle: name,
        },
        data: {
          title,
          price,
          sku,
          grams,
          stock,
          compare_price,
          barcode,
          description,
        },
      });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: "Error updating product" });
    }
  }

  async delete(req: Request, res: Response) {
    const { name } = req.params;
    try {
      await prisma.product.delete({
        where: {
          handle: name,
        },
      });
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: "Error deleting product" });
    }
  }
}

export default new productController();
