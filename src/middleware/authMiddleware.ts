import * as jose from "jose";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

const requireAuth = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;

  if (token) {
    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET as string),
        {
          algorithms: ["HS256"],
        }
      );

      const date = new Date((payload?.exp as number) * 1000);
      const currentDate = new Date();

      if (date < currentDate) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

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
