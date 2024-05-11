import * as jose from "jose";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

const requireAuth = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;

  if (token) {
    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET as string),
        {
          algorithms: ["HS256"],
        }
      );

      const user = await prisma.user.findUnique({
        where: {
          id: payload.id as string,
        },
      });

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      next();

      return;
    } catch (err) {
      console.log(err);
    }
  }

  return res.status(401).json({ error: "Unauthorized" });
};

export default requireAuth;