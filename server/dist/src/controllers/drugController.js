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
exports.getSmiles = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSmiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { name } = req.query;
    if (!name)
        return res.status(400).json({ error: 'Drug name is required' });
    try {
        const response = yield (0, node_fetch_1.default)(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/SMILES/JSON`);
        const data = (yield response.json());
        const smiles = ((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.PropertyTable) === null || _a === void 0 ? void 0 : _a.Properties) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.SMILES) || null;
        if (!smiles)
            return res.status(404).json({ error: 'SMILES not found' });
        const savedDrug = yield prisma.drug.upsert({
            where: { name },
            update: { smiles },
            create: { name, smiles },
        });
        return res.json({ name: savedDrug.name, smiles: savedDrug.smiles });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch SMILES' });
    }
});
exports.getSmiles = getSmiles;
