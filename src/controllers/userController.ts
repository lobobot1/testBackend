import { Request, Response } from 'express';
import prisma from '../../lib/prisma';

class userController {
    async getById(req: Request, res: Response){
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "Id is required" });
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id.trim(),
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            });

            if (!user) {
                res.status(400).json({ error: "User not found" });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: "User not found" });
        }
    }
}

export default new userController();