// /state/moleculeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneratedMolecule {
  structure: string;
  score: number;
}

export interface HistoryEntry {
  id: number;
  drugName: string;
  smiles: string;
  numMolecules: number;
  minSimilarity: number;
  particles: number;
  iterations: number;
  generatedMolecules: GeneratedMolecule[];
  createdAt: string;
}

export interface MoleculeState {
  smiles: string;
  drugName: string;
  numMolecules: string;
  minSimilarity: string;
  particles: string;
  iterations: string;
  loading: boolean;
  generated: GeneratedMolecule[];
  history: HistoryEntry[];
}

const initialState: MoleculeState = {
  smiles: "CCN(CC)C(=O)[C@@]1(C)Nc2c(ccc3ccccc23)C[C@H]1N(C)C",
  drugName: "",
  numMolecules: "10",
  minSimilarity: "0.3",
  particles: "30",
  iterations: "10",
  loading: false,
  generated: [],
  history: [],
};

const moleculeSlice = createSlice({
  name: "molecule",
  initialState,
  reducers: {
    setSmiles: (state, action: PayloadAction<string>) => {
      state.smiles = action.payload;
    },
    setDrugName: (state, action: PayloadAction<string>) => {
      state.drugName = action.payload;
    },
    setNumMolecules: (state, action: PayloadAction<string>) => {
      state.numMolecules = action.payload;
    },
    setMinSimilarity: (state, action: PayloadAction<string>) => {
      state.minSimilarity = action.payload;
    },
    setParticles: (state, action: PayloadAction<string>) => {
      state.particles = action.payload;
    },
    setIterations: (state, action: PayloadAction<string>) => {
      state.iterations = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGeneratedMolecules: (state, action: PayloadAction<GeneratedMolecule[]>) => {
      state.generated = action.payload;
    },
    setHistory: (state, action: PayloadAction<HistoryEntry[]>) => {
      state.history = action.payload;
    },
    addHistoryEntry: (state, action: PayloadAction<HistoryEntry>) => {
      state.history.unshift(action.payload);
    },
    clearGeneratedMolecules: (state) => {
      state.generated = [];
    },
    resetForm: (state) => {
      state.smiles = "";
      state.drugName = "";
      state.numMolecules = "10";
      state.minSimilarity = "0.3";
      state.particles = "30";
      state.iterations = "10";
    },
    resetFormExceptDrug: (state) => {
      state.smiles = "";
      state.numMolecules = " ";
      state.minSimilarity = " ";
      state.particles = " ";
      state.iterations = " ";
      state.generated = [];
    },

  },
});

export const {
  setSmiles,
  setDrugName,
  setNumMolecules,
  setMinSimilarity,
  setParticles,
  setIterations,
  setLoading,
  setGeneratedMolecules,
  setHistory,
  addHistoryEntry,
  clearGeneratedMolecules,
  resetForm,
  resetFormExceptDrug,
} = moleculeSlice.actions;

export default moleculeSlice.reducer;
