"use client";

import React from "react";
import { History } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setSelectedHistoryId } from "@/state/historySlice";
import {
  setGeneratedMolecules,
  setSmiles,
  setDrugName,
  setNumMolecules,
  setMinSimilarity,
  setParticles,
  setIterations,
} from "@/state/moleculeSlice";

interface HistorySidebarProps {
  visible: boolean; // controls show/hide
  onClose: ()=> void;
  currentAnalysisSetter: (value: any) => void; // function to reset analysis
  generateMockAnalysis: () => any; // function to generate mock analysis
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  visible,
  onClose,
  currentAnalysisSetter,
  generateMockAnalysis,
}) => {
  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => state.molecule.history);
  const selectedHistoryId = useAppSelector(
    (state) => state.history.selectedHistoryId
  );

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-32 px-4 "  onClick={onClose}>
      <div className="w-full max-w-7xl " onClick={(e) => e.stopPropagation()}>
        <div className="bg-white/80 dark:bg-gray-850/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
              <History className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Generated SMILES
            </h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
              {history.length} runs
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                No predictions yet.
              </p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => {
                    dispatch(setSelectedHistoryId(entry.id));
                    dispatch(setGeneratedMolecules(entry.generatedMolecules));
                    dispatch(setSmiles(entry.smiles));
                    dispatch(setDrugName(entry.drugName));
                    dispatch(setNumMolecules(entry.numMolecules.toString()));
                    dispatch(setMinSimilarity(entry.minSimilarity.toString()));
                    dispatch(setParticles(entry.particles.toString()));
                    dispatch(setIterations(entry.iterations.toString()));
                    currentAnalysisSetter(generateMockAnalysis());
                  }}
                  className={`group p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedHistoryId === entry.id
                      ? "bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 shadow-sm"
                      : "bg-white/80 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate max-w-[120px]">
                      {entry.drugName || "Custom Search"}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-300 truncate mb-2">
                    {entry.smiles}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 font-medium">
                      Mols: {entry.numMolecules}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      Sim: {entry.minSimilarity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;
