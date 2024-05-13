import { Request, Response } from "express";
import prisma from "../../lib/prisma";

interface Product {
  handle: string;
  title: string;
  price: number;
  sku: string;
  grams: number;
  stock: number;
  compare_price: number;
  barcode: string;
  description: string;
}

class productController {
  async get(req: Request, res: Response) {
    const { pagination } = req.params;

    if (!pagination) {
      return res.status(400).json({ error: "Missing pagination" });
    }

    if (isNaN(parseInt(pagination)) || parseInt(pagination) < 1) {
      return res.status(400).json({ error: "Invalid pagination" });
    }

    const page = parseInt(pagination);

    try {
      const products = await prisma.product.findMany({
        skip: (page - 1) * 16,
        take: 16,
        select: {
          handle: true,
          title: true,
          price: true,
          stock: true,
        },
      });

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
    }
  }

  async getById(req: Request, res: Response) {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: "Missing product name" });
    }

    try {
      const product = await prisma.product.findUnique({
        where: {
          handle: name,
        },
        select: {
          handle: true,
          title: true,
          price: true,
          sku: true,
          grams: true,
          stock: true,
          compare_price: true,
          barcode: true,
          description: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: "Error fetching product" });
    }
  }

  async create(req: Request, res: Response) {
    const {
      title,
      price,
      sku,
      grams,
      stock,
      compare_price,
      barcode,
      description,
    } = req.body as Product;

    const handle = title.split(" ").join("-");

    if (
      !title ||
      !price ||
      !sku ||
      !grams ||
      !stock ||
      !compare_price ||
      !barcode ||
      !description ||
      Number.isNaN(price) ||
      Number.isNaN(grams) ||
      Number.isNaN(stock) ||
      Number.isNaN(compare_price) ||
      Number(price) < 0 ||
      Number(grams) < 0 ||
      Number(stock) < 0 ||
      Number(compare_price) < 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const productExists = await prisma.product.findUnique({
        where: {
          handle,
        },
      });

      if (productExists) {
        return res.status(400).json({ error: "Product already exists" });
      }

      const product = await prisma.product.create({
        data: {
          handle,
          title: title.toUpperCase(),
          price: Number(price),
          sku,
          grams: Number(grams),
          stock: Number(stock),
          compare_price: Number(compare_price),
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
    const {
      price,
      sku,
      grams,
      stock,
      compare_price,
      barcode,
      description,
      title,
    } = req.body as Product;

    if (
      !name ||
      !price ||
      !sku ||
      !grams ||
      !stock ||
      !compare_price ||
      !barcode ||
      !description ||
      !title ||
      Number.isNaN(price) ||
      Number.isNaN(grams) ||
      Number.isNaN(stock) ||
      Number.isNaN(compare_price) ||
      Number(price) < 0 ||
      Number(grams) < 0 ||
      Number(stock) < 0 ||
      Number(compare_price) < 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const auxProduct = await prisma.product.findUnique({
        where: {
          handle: name,
        },
      });

      if (!auxProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = await prisma.product.update({
        where: {
          handle: name,
        },
        data: {
          title: title.toUpperCase(),
          price: Number(price),
          sku,
          grams: Number(grams),
          stock: Number(stock),
          compare_price: Number(compare_price),
          barcode,
          description,
        },
      });
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error updating product" });
    }
  }

  async delete(req: Request, res: Response) {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: "Missing product name" });
    }

    try {
      const product = await prisma.product.findUnique({
        where: {
          handle: name,
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

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

  async total(req: Request, res: Response) {
    try {
      const total = await prisma.product.count();
      res.status(200).json({ total });
    } catch (err) {
      res.status(500).json({ error: "Error fetching total products" });
    }
  }
}

export default new productController();
