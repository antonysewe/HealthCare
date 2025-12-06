import { Router } from 'express';
import { getSmiles } from '../controllers/drugController';

const router = Router();

// GET /api/drugs/smiles?name=aspirin
router.get('/smiles', getSmiles);

export default router;
