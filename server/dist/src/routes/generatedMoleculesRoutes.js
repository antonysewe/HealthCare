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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/moleculesRoutes.ts
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = (0, express_1.Router)();
router.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const API_KEY = "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";
    const invokeUrl = "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";
    try {
        const response = yield (0, node_fetch_1.default)(invokeUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error("Error calling NVIDIA API:", error);
        res.status(500).json({ message: "Failed to generate molecules" });
    }
}));
exports.default = router;
