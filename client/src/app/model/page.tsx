"use client";

import React, { useState, useEffect } from "react";
import MoleculeStructure from "../../components/MoleculeStructure/index";
import { History, Activity, Atom } from 'lucide-react';

interface GeneratedMolecule {
  structure: string;
  score: number;
}

interface HistoryEntry {
  id: number;
  smiles: string;
  numMolecules: number;
  minSimilarity: number;
  particles: number;
  iterations: number;
  generatedMolecules: GeneratedMolecule[];
  createdAt: string;
}

const ModalLayout = () => {
  const [smiles, setSmiles] = useState(
    "CCN(CC)C(=O)[C@@]1(C)Nc2c(ccc3ccccc23)C[C@H]1N(C)C"
  );
  const [numMolecules, setNumMolecules] = useState("10");
  const [minSimilarity, setMinSimilarity] = useState("0.3");
  const [particles, setParticles] = useState("30");
  const [iterations, setIterations] = useState("10");

  const [molecules, setMolecules] = useState<GeneratedMolecule[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = 1; // Example user ID

  // Fetch history from server
  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/molecules/history/${userId}`);
      const data: HistoryEntry[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        (mol: any) => ({
          structure: mol.sample,
          score: mol.score,
        })
      );

      setMolecules(generatedMolecules);

      // Save history
      await fetch("http://localhost:8000/molecules/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
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
      setLoading(false);
    }
  };

  // Card container classes for light & dark mode
  const cardClasses = "rounded-xl border shadow-2xl transition-colors " +
    "bg-white border-gray-300 dark:bg-gray-950 dark:border-gray-800";

  return (
    <>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
        {/* Form Section */}
        <div className="flex flex-col gap-9 sm:col-span-2">
          <div className={cardClasses}>
            <div className="border-b border-gray-300 dark:border-gray-800 px-6.5 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="h-5 w-5 text-sky-500 mr-2"/>
                SMILES to Molecule Generator
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* SMILES & Number */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-2/3">
                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SMILES String
                    </label>
                    <input
                      type="text"
                      value={smiles}
                      onChange={(e) => setSmiles(e.target.value)}
                      placeholder="Enter SMILES string"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-white outline-none transition focus:border-sky-500 active:border-sky-500 placeholder-gray-500 text-sm resize-none"
                    />
                  </div>

                  <div className="w-full xl:w-1/3">
                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Number of Molecules
                    </label>
                    <input
                      type="text"
                      value={numMolecules}
                      onChange={(e) => setNumMolecules(e.target.value)}
                      placeholder="Enter number of molecules"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-white outline-none transition focus:border-sky-500 active:border-sky-500 placeholder-gray-500 text-sm"
                    />
                  </div>
                </div>

                {/* Other parameters */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Similarity
                  </label>
                  <input
                    type="text"
                    value={minSimilarity}
                    onChange={(e) => setMinSimilarity(e.target.value)}
                    placeholder="Enter minimum similarity"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-white outline-none transition focus:border-sky-500 active:border-sky-500 placeholder-gray-500 text-sm"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Particles
                  </label>
                  <input
                    type="text"
                    value={particles}
                    onChange={(e) => setParticles(e.target.value)}
                    placeholder="Enter number of particles"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-white outline-none transition focus:border-sky-500 active:border-sky-500 placeholder-gray-500 text-sm"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Iterations
                  </label>
                  <input
                    type="text"
                    value={iterations}
                    onChange={(e) => setIterations(e.target.value)}
                    placeholder="Enter number of iterations"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-white outline-none transition focus:border-sky-500 active:border-sky-500 placeholder-gray-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-sky-600 p-3 font-bold text-white hover:bg-sky-500 transition-colors duration-200 shadow-lg shadow-sky-600/30"
                  disabled={loading}
                >
                  {loading ? (
                     <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </span>
                  ) : ("Generate Molecules")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History Section */}
        <div className="flex flex-col gap-9">
          <div className={cardClasses + " h-full"}>
            <div className="border-b border-gray-300 dark:border-gray-800 px-6.5 py-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <History className="h-5 w-5 text-gray-500 mr-2"/>
                Molecule Generation History
              </h3>
            </div>
            <div className="p-3 max-h-[80vh] overflow-y-auto">
              {history.map((entry) => (
                <div key={entry.id} className="border-b border-gray-300 dark:border-gray-800 py-3 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-900 transition-colors duration-150 rounded-md px-2">
                  <p className="text-sm text-gray-900 dark:text-white flex justify-between">
                    <span className="font-bold text-sky-400">SMILES:</span> <span className="text-gray-500 dark:text-gray-400 truncate ml-2"> {entry.smiles} </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-sky-400">Molecules:</span>{" "}
                    {entry.numMolecules} | <span className="font-bold text-sky-400">Sim:</span> {entry.minSimilarity}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <span className="font-bold">Date:</span>{" "}
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-3">
                    <button
                      className="text-sky-400 hover:text-sky-300 hover:underline text-sm font-medium transition-colors"
                      onClick={() => setMolecules(entry.generatedMolecules)}
                    >
                      View Molecules
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Display generated molecules */}
      {molecules.length > 0 && (
        <div className={cardClasses + " mt-8"}>
          <div className="border-b border-gray-300 dark:border-gray-800 px-6.5 py-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Atom className="h-5 w-5 text-sky-500 mr-2 animate-pulse"/>
                Generated Molecules ({molecules.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {molecules.map((mol, index) => (
                <MoleculeStructure
                  key={index}
                  id={`mol-${index + 1}`}
                  structure={mol.structure}
                  scores={mol.score}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalLayout;
