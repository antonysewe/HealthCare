"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMoleculeHistory = exports.createMoleculeHistory = exports.getMoleculeHistoryByUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all molecule generation history for a user
const getMoleculeHistoryByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const history = yield prisma.moleculeGenerationHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(history);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving history: ${error.message}` });
    }
});
exports.getMoleculeHistoryByUser = getMoleculeHistoryByUser;
// Create a new molecule generation history entry
const createMoleculeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, drugName, smiles, numMolecules, minSimilarity, particles, iterations, generatedMolecules, } = req.body;
    try {
        const newHistory = yield prisma.moleculeGenerationHistory.create({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating history entry: ${error.message}` });
    }
});
exports.createMoleculeHistory = createMoleculeHistory;
// Optional: Delete a history entry
const deleteMoleculeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const historyId = parseInt(req.params.id);
    try {
        const deletedEntry = yield prisma.moleculeGenerationHistory.delete({
            where: { id: historyId },
        });
        res.json(deletedEntry);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error deleting history: ${error.message}` });
    }
});
exports.deleteMoleculeHistory = deleteMoleculeHistory;
