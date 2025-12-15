"use client";

import React, { useState, useEffect } from "react";
import MoleculeStructure from "../../components/MoleculeStructure/index"; 
import { 
  History, 
  Activity, 
  FlaskConical, 
  Zap, 
  Droplets, 
  Skull 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import {
  setDrugName,
  setSmiles,
  setNumMolecules,
  setMinSimilarity,
  setParticles,
  setIterations,
  setLoading,
  setGeneratedMolecules,
  setHistory,
} from "@/state/moleculeSlice"; 
import HistorySidebar from "@/components/HistorySidebar";
import GeneratedVariantsPanel from "@/components/GeneratedVariantsPanel";

// --- INTERFACES ---
interface MoleculeAnalysis {
  activity: number;
  solubility: number;
  toxicity: number;
  metabolism: number;
  lipinski: number;
  synthesizability: number;
}

interface GeneratedMolecule {
  structure: string;
  score: number;
}

interface HistoryEntry {
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

// --- SUB-COMPONENTS ---
const ProgressBar = ({ label, value, colorClass = "bg-blue-600" }: { label: string, value: number, colorClass?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <span className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')}`}>{value}</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
      <div 
        className={`${colorClass} h-4 rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${value * 100}%` }}
      ></div>
    </div>
  </div>
);

const StatBadge = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">{label}</span>
    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{value}</span>
  </div>
);

// --- ADMET Comparison Bar ---
interface AdmetCompareBarProps {
  label: string;
  original: number;
  variant?: number;
  color: string;
  inverse?: boolean;
}

const AdmetCompareBar: React.FC<AdmetCompareBarProps> = ({
  label,
  original,
  variant,
  color,
  inverse = false,
}) => {
  const normOriginal = inverse ? 1 - original : original;
  const normVariant = variant !== undefined
    ? inverse ? 1 - variant : variant
    : null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex gap-4 font-mono">
          <span className="text-gray-900 dark:text-white">O: {original.toFixed(2)}</span>
          {variant !== undefined && <span className="text-blue-600 dark:text-blue-400">V: {variant.toFixed(2)}</span>}
        </div>
      </div>

      <div className="relative h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-4 bg-gray-400 dark:bg-gray-500 rounded-full transition-all duration-700"
          style={{ width: `${normOriginal * 100}%` }}
        />
        {normVariant !== null && (
          <div
            className={`absolute left-0 top-0 h-4 ${color} rounded-full opacity-80 transition-all duration-700`}
            style={{ width: `${normVariant * 100}%` }}
          />
        )}
      </div>
      {inverse && <p className="text-xs text-gray-500 dark:text-gray-400">Lower is better</p>}
    </div>
  );
};

// --- MAIN COMPONENT ---
const BioactivityDashboard = () => {
  const dispatch = useAppDispatch();

  const {
    smiles,
    drugName,
    numMolecules,
    minSimilarity,
    particles,
    iterations,
    loading,
    generated,
    history,
  } = useAppSelector((state) => state.molecule);

  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<GeneratedMolecule | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<MoleculeAnalysis | null>(null);
  const [variantAnalysis, setVariantAnalysis] = useState<MoleculeAnalysis | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const userId = 1;

  // --- API / History ---
  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/molecules/history/${userId}`);
      const data: HistoryEntry[] = await res.json();
      dispatch(setHistory(data));
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (smiles) setCurrentAnalysis(generateMockAnalysis());
  }, []);

  // Reload when SMILES changes (history selection)
  useEffect(() => {
    setSelectedVariant(null);
    if (smiles) setCurrentAnalysis(generateMockAnalysis());
  }, [smiles]);

  // Generate variant analysis when variant changes
  useEffect(() => {
    if (selectedVariant?.structure) setVariantAnalysis(generateMockAnalysis());
    else setVariantAnalysis(null);
  }, [selectedVariant]);

  const generateMockAnalysis = (): MoleculeAnalysis => ({
    activity: parseFloat((Math.random() * (0.9 - 0.5) + 0.5).toFixed(2)),
    solubility: parseFloat((Math.random() * (0.8 - 0.4) + 0.4).toFixed(2)),
    toxicity: parseFloat((Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)),
    metabolism: parseFloat((Math.random() * (0.8 - 0.3) + 0.3).toFixed(2)),
    lipinski: parseFloat((Math.random() * (0.95 - 0.7) + 0.7).toFixed(2)),
    synthesizability: parseFloat((Math.random() * (0.9 - 0.5) + 0.5).toFixed(2)),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setCurrentAnalysis(generateMockAnalysis());

    const payload = {
      algorithm: "CMA-ES",
      num_molecules: parseInt(numMolecules),
      property_name: "QED",
      minimize: false,
      min_similarity: parseFloat(minSimilarity),
      particles: parseInt(particles),
      iterations: parseInt(iterations),
      smi: smiles,
    };

    try {
      const response = await fetch("http://localhost:8000/api/molecules/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const generatedMolecules: GeneratedMolecule[] = JSON.parse(data.molecules).map(
        (mol: any) => ({ structure: mol.sample, score: mol.score })
      );

      dispatch(setGeneratedMolecules(generatedMolecules));

      await fetch("http://localhost:8000/molecules/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          drugName,
          smiles,
          numMolecules: parseInt(numMolecules),
          minSimilarity: parseFloat(minSimilarity),
          particles: parseInt(particles),
          iterations: parseInt(iterations),
          generatedMolecules,
        }),
      });

      fetchHistory();
    } catch (error) {
      console.error("Error generating molecules:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-sans text-gray-800 dark:text-gray-200">
      

      <div className="rounded-xl border shadow-2xl transition-colors bg-white border-gray-300 dark:bg-gray-950 dark:border-gray-800">
        <div className="lg:col-span-2 space-y-6 p-8">
          
          {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Predict Bioactivity and Properties</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">AI-driven analysis and optimization of chemical structures.</p>
          </div>
        </div>

          {/* Drug SMILES Input */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Load Existing Drug</h3>
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 max-w-[75%]">
                <input
                  type="text"
                  value={drugName}
                  onChange={(e) => dispatch(setDrugName(e.target.value))}
                  placeholder="Drug name (e.g. Aspirin)"
                  className="max-w-sm px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setShowHistory(prev => !prev)}
                className="ml-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                <History className="h-4 w-4" />
                {showHistory ? "Hide SMILES" : "Generated SMILES"}
              </button>
            </div>
          </div>

          {/* SMILES Input box */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={smiles}
                onChange={(e) => dispatch(setSmiles(e.target.value))}
                className="w-full pl-4 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                placeholder="Original SMILES string..."
              />
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={selectedVariant?.structure || ""}
                onChange={(e) => {
                  if (selectedVariant) {
                    setSelectedVariant({ ...selectedVariant, structure: e.target.value });
                  } else {
                    setSelectedVariant({ structure: e.target.value, score: 0 });
                  }
                }}
                className="w-full pl-4 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                placeholder="Variant SMILES string..."
              />
            </div>
          </div>

          {/* Generated Variants */}
          <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
            <button
              onClick={() => setShowVariants(prev => !prev)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Generated Variants
              <span className="ml-1 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                {generated.length}
              </span>
            </button>

            <GeneratedVariantsPanel
              visible={showVariants}
              onClose={() => setShowVariants(false)}
              generated={generated}
              onSelectVariant={(variant) => setSelectedVariant(variant)}
            />

            {smiles && (
              <div className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="flex-1 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Original</h4>
                  <MoleculeStructure
                    id="original-structure"
                    structure={smiles}
                    scores={currentAnalysis?.lipinski || 0}
                  />
                </div>

                <div className="flex-1 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Variant</h4>
                  <MoleculeStructure
                    id="variant-structure"
                    structure={selectedVariant?.structure || "C"}
                    scores={selectedVariant?.score || 0}
                  />
                  {selectedVariant && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Score: {selectedVariant.score.toFixed(2)}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Data Visualization */}
          {currentAnalysis && (
            <div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">ADMET Properties</h3>
                <h4 className="text-base md:text-lg font-semibold tracking-wide mb-6 text-gray-800 dark:text-gray-200">
                  Absorption, Distribution, Metabolism, Excretion, Toxicity
                </h4>

                <div className="mb-8 space-y-3">
                  <p className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                    Why it matters:
                    <span className="ml-2 font-normal text-gray-600 dark:text-gray-400">
                      Drug candidates often fail due to poor ADMET properties.
                    </span>
                  </p>

                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      Absorption:
                    </span>{" "}
                    Solubility, intestinal permeability
                  </p>

                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      Distribution:
                    </span>{" "}
                    Blood–brain barrier penetration
                  </p>

                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Metabolism:
                    </span>{" "}
                    Likelihood of cytochrome P450 interactions
                  </p>

                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      Excretion:
                    </span>{" "}
                    Clearance predictions
                  </p>

                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-red-600 dark:text-red-400">
                      Toxicity:
                    </span>{" "}
                    Liver toxicity, mutagenicity, hERG inhibition
                  </p>
                </div>

               {/* Horizontal container for ADMET Comparison + Drug-Likeness */}
                <div className="flex flex-col md:flex-row gap-12">
                  {/* ADMET Comparison */}
                  <div className="flex-1">
                    <h3 className="text-blue-600 font-bold text-lg mb-1">
                      ADMET Comparison
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                      Original vs Variant (overlayed)
                    </p>

                    <div className="space-y-6 max-w-2xl">
                      <AdmetCompareBar
                        label="Activity"
                        original={currentAnalysis.activity}
                        variant={variantAnalysis?.activity}
                        color="bg-blue-500"
                      />
                      <AdmetCompareBar
                        label="Solubility"
                        original={currentAnalysis.solubility}
                        variant={variantAnalysis?.solubility}
                        color="bg-teal-500"
                      />
                      <AdmetCompareBar
                        label="Metabolism"
                        original={currentAnalysis.metabolism}
                        variant={variantAnalysis?.metabolism}
                        color="bg-indigo-500"
                      />
                      <AdmetCompareBar
                        label="Toxicity"
                        original={currentAnalysis.toxicity}
                        variant={variantAnalysis?.toxicity}
                        color="bg-red-500"
                        inverse
                      />
                    </div>

                    <div className="flex gap-6 mt-6 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gray-400 rounded-full" />
                        <span>Original</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>Variant</span>
                      </div>
                    </div>
                  </div>

                  {/* Drug-Likeness */}
                  {/* Drug-Likeness Panel */}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Drug-Likeness</h3>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-6">

                      {/* Lipinski Score */}
                      <div>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">
                          <span className="font-bold">Lipinski Score:</span> Evaluates whether a compound has properties consistent with orally active drugs.
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${(variantAnalysis?.lipinski || 0) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Variant: {(variantAnalysis?.lipinski || 0).toFixed(2)}</p>
                      </div>

                      {/* Synthesizability */}
                      <div>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">
                          <span className="font-bold">Synthesizability:</span> Indicates the ease of chemical synthesis for the molecule.
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${(variantAnalysis?.synthesizability || 0) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Variant: {(variantAnalysis?.synthesizability || 0).toFixed(2)}</p>
                      </div>

                      {/* QED Score */}
                      <div>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">
                          <span className="font-bold">QED Score:</span> Quantitative estimate of drug-likeness combining multiple properties into a single metric.
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className="bg-teal-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${((variantAnalysis?.lipinski || 0) * 0.9) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Variant: {variantAnalysis ? ((variantAnalysis.lipinski * 0.9).toFixed(2)) : 0}
                        </p>
                      </div>

                    </div>
                  </div>

                  
                </div>



              </div>
            </div>
          )}

        </div>

        {/* History Sidebar */}
        <HistorySidebar
          visible={showHistory}
          onClose={() => setShowHistory(false)}
          currentAnalysisSetter={setCurrentAnalysis}
          generateMockAnalysis={generateMockAnalysis}
        />
      </div>
    </div>
  );
};

export default BioactivityDashboard;
