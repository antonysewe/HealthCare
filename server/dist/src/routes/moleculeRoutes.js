"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moleculeController_1 = require("../controllers/moleculeController");
const router = express_1.default.Router();
// Get history by user ID
router.get("/history/:userId", moleculeController_1.getMoleculeHistoryByUser);
// Create a new history entry
router.post("/history", moleculeController_1.createMoleculeHistory);
// Delete a history entry
router.delete("/history/:id", moleculeController_1.deleteMoleculeHistory);
exports.default = router;
