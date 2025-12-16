"use client";
import { useState } from "react";


const API_BASE: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://fallback-api.com';

interface DrugSmilesFetcherProps {
  onSmilesSelect: (smiles: string, drugName: string) => void;
}

const DrugSmilesFetcher: React.FC<DrugSmilesFetcherProps> = ({ onSmilesSelect }) => {
  const [drug, setDrug] = useState("");
  const [error, setError] = useState("");

  const fetchSmiles = async () => {
    setError("");
    if (!drug) return;

    try {
      const res = await fetch(`${API_BASE}/api/drugs/smiles?name=${encodeURIComponent(drug)}`);
      const data: { smiles?: string; error?: string } = await res.json();

      if (data.smiles) {
        onSmilesSelect(data.smiles, drug); // <-- send to parent
      } else {
        setError(data.error || "SMILES not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch SMILES");
    }
  };

  return (
     <div className="flex gap-3 items-center max-w-md">
      <input
        type="text"
        value={drug}
        onChange={(e) => setDrug(e.target.value)}
        placeholder="Enter drug name"
        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-5 py-3 text-gray-900 dark:text-white outline-none transition focus:border-sky-500 active:border-sky-500 placeholder-gray-500"
      />
      <button
        onClick={fetchSmiles}
        className="px-5 py-3 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/30 cursor-pointer"
      >
        Get SMILES
      </button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>

  );
};

export default DrugSmilesFetcher;

