"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drugController_1 = require("../controllers/drugController");
const router = (0, express_1.Router)();
// GET /api/drugs/smiles?name=aspirin
router.get('/smiles', drugController_1.getSmiles);
exports.default = router;
