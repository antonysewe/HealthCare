import express from "express";
import {
  getMoleculeHistoryByUser,
  createMoleculeHistory,
  deleteMoleculeHistory,
} from "../controllers/moleculeController";

const router = express.Router();

// Get history by user ID
router.get("/history/:userId", getMoleculeHistoryByUser);

// Create a new history entry
router.post("/history", createMoleculeHistory);

// Delete a history entry
router.delete("/history/:id", deleteMoleculeHistory);

export default router;