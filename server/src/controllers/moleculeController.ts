import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all molecule generation history for a user
export const getMoleculeHistoryByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.userId);
  try {
    const history = await prisma.moleculeGenerationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(history);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving history: ${error.message}` });
  }
};

// Create a new molecule generation history entry
export const createMoleculeHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    userId,
    drugName,
    smiles,
    numMolecules,
    minSimilarity,
    particles,
    iterations,
    generatedMolecules,
  } = req.body;

  try {
    const newHistory = await prisma.moleculeGenerationHistory.create({
      data: {
        userId,
        drugName,
        smiles,
        numMolecules,
        minSimilarity,
        particles,
        iterations,
        generatedMolecules,
      },
    });
    res.status(201).json(newHistory);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating history entry: ${error.message}` });
  }
};

// Optional: Delete a history entry
export const deleteMoleculeHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const historyId = parseInt(req.params.id);
  try {
    const deletedEntry = await prisma.moleculeGenerationHistory.delete({
      where: { id: historyId },
    });
    res.json(deletedEntry);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting history: ${error.message}` });
  }
};
