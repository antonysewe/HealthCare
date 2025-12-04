"use client";

import React, { useState, useEffect } from "react";
import MoleculeStructure from "../MoleculeStructure/index";

const moleculeBank = [
  {
    moleculeName: "Aspirin",
    smilesStructure: "CC(=O)OC1=CC=CC=C1C(O)=O",
    molecularWeight: 180.16,
    categoryUsage: "Pain reliever/NSAID",
  },
  {
    moleculeName: "Caffeine",
    smilesStructure: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    molecularWeight: 194.19,
    categoryUsage: "Stimulant",
  },
  {
    moleculeName: "Benzene",
    smilesStructure: "C1=CC=CC=C1",
    molecularWeight: 78.11,
    categoryUsage: "Industrial solvent",
  },
  {
    moleculeName: "Glucose",
    smilesStructure: "C(C1C(C(C(C(O1)O)O)O)O)O",
    molecularWeight: 180.16,
    categoryUsage: "Energy source/sugar",
  },
  {
    moleculeName: "Penicillin",
    smilesStructure: "CC1(C2C(C(C(O2)N1C(=O)COC(=O)C)C)S)C=O",
    molecularWeight: 334.39,
    categoryUsage: "Antibiotic",
  },
  {
    moleculeName: "Ibuprofen",
    smilesStructure: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    molecularWeight: 206.28,
    categoryUsage: "Pain reliever/NSAID",
  },
  {
    moleculeName: "Acetaminophen",
    smilesStructure: "CC(=O)NC1=CC=C(O)C=C1",
    molecularWeight: 151.16,
    categoryUsage: "Pain reliever/Antipyretic",
  },
  {
    moleculeName: "Morphine",
    smilesStructure: "CN1CCC23C4C1CC(C2C3O)OC5=CC=CC=C45",
    molecularWeight: 285.34,
    categoryUsage: "Pain reliever/Opiate",
  },
  {
    moleculeName: "Nicotine",
    smilesStructure: "CN1CCCC1C2=CN=CC=C2",
    molecularWeight: 162.23,
    categoryUsage: "Stimulant",
  },
  {
    moleculeName: "Ethanol",
    smilesStructure: "CCO",
    molecularWeight: 46.07,
    categoryUsage: "Alcohol/Disinfectant",
  },
];

const TableOne = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMolecules, setFilteredMolecules] = useState(moleculeBank);

  useEffect(() => {
    const filteredData = moleculeBank.filter((molecule) =>
      molecule.moleculeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMolecules(filteredData);
  }, [searchQuery]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 p-6">
      <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-200">
        Molecules
      </h4>

      <input
        type="search"
        placeholder="Search molecule"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm outline-none focus:border-sky-500 focus:ring focus:ring-sky-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
      />

      <div className="flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-3 rounded-t-lg bg-gray-100 dark:bg-gray-800 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase text-gray-900 dark:text-gray-200 xsm:text-base">
              Molecule Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase text-gray-900 dark:text-gray-200 xsm:text-base">
              Smile Structure Image
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase text-gray-900 dark:text-gray-200 xsm:text-base">
              Molecular Weight (g/mol)
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase text-gray-900 dark:text-gray-200 xsm:text-base">
              Category Usage
            </h5>
          </div>
        </div>

        {/* Table Rows */}
        {filteredMolecules.map((molecule, key) => (
          <div
            key={key}
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key !== filteredMolecules.length - 1
                ? "border-b border-gray-200 dark:border-gray-700"
                : ""
            }`}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-gray-900 dark:text-gray-200">{molecule.moleculeName}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <MoleculeStructure id={`${key}`} structure={molecule.smilesStructure} />
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-gray-900 dark:text-gray-200">{molecule.molecularWeight}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-gray-900 dark:text-gray-200">{molecule.categoryUsage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
