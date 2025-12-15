"use client";

import React from "react";
import { Zap } from "lucide-react";
import MoleculeStructure from "@/components/MoleculeStructure";

interface GeneratedVariant {
  structure: string;
  score: number;
}

interface GeneratedVariantsPanelProps {
  visible: boolean;
  onClose: () => void;
  generated: GeneratedVariant[];
  onSelectVariant?: (variant: GeneratedVariant) => void;
}

const GeneratedVariantsPanel: React.FC<GeneratedVariantsPanelProps> = ({
  visible,
  onClose,
  generated,
  onSelectVariant,
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start pt-32 px-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-7xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/80 dark:bg-gray-850/80 backdrop-blur-md
                        rounded-2xl shadow-lg border
                        border-gray-200 dark:border-gray-800 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Generated Variants
            </h3>

            <span className="text-xs bg-gray-100 dark:bg-gray-700
                             text-gray-500 dark:text-gray-400
                             px-2 py-1 rounded-full">
              {generated.length}
            </span>
          </div>

          {/* Content */}
          {generated.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
              No variants generated yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3
                            max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {generated.map((mol, index) => (
                <div
                  key={index}
                  onClick={() => onSelectVariant?.(mol)} // <-- call callback when clicked
                  className="flex flex-col items-center
                             bg-gray-50 dark:bg-gray-800
                             rounded-lg p-4 border
                             border-gray-100 dark:border-gray-700
                             hover:border-blue-300 dark:hover:border-blue-500
                             cursor-pointer transition-colors"
                >
                  <MoleculeStructure
                    id={`variant-${index}`}
                    structure={mol.structure}
                    scores={mol.score}
                  />
                   <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Score: {mol.score.toFixed(2)}
                   </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedVariantsPanel;
