import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import * as jose from "jose";
import dotenv from "dotenv";

dotenv.config();

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const maxAge = 30 * 24 * 60 * 60;

const createToken = async (user: Omit<User, "password">) => {
  const secret = new TextEncoder().encode(
    "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
  );

  const token = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("4 weeks")
    .sign(secret);

  return token;
};

class authController {
  async login_post(req: Request, res: Response) {
    const { email, password } = req.body as Omit<
      User,
      "firstName" | "lastName"
    >;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const auth = await bcrypt.compare(password, user.password);

      if (!auth) {
        res.status(400).json({ error: "Incorrect password" });
        return;
      }

      const token = await createToken(user);

      res.status(200).json({ message: "User logged in" });
    } catch (error) {
      res.status(400).json({ error: "User not found" });
    }
  }

  async register_post(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body as User;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const auxUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (auxUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          id: true,
        },
      });
      const token = await createToken(user);
      
      return res.status(201).json({ message: "User created", token });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "User not created" });
    }
  }
}

export default new authController();
