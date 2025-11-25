import { Router } from "express";
import { getMolecules} from "../controllers/moleculesBankController" 
const router = Router();

router.get("/", getMolecules);
//router.post("/", createMolecule);

export default router;