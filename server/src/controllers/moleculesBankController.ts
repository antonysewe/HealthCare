import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMolecules = async (
    req: Request,
    res: Response
): Promise<void> => {
    // Implementation for retrieving molecules
    try {
        const molecules = await prisma.molecule.findMany();
        res.json(molecules);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error retrieving Molecules: ${error.message}` });
    }
}