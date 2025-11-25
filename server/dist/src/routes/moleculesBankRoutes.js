"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moleculesBankController_1 = require("../controllers/moleculesBankController");
const router = (0, express_1.Router)();
router.get("/", moleculesBankController_1.getMolecules);
//router.post("/", createMolecule);
exports.default = router;
