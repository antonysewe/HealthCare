import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PubChemResponse {
  PropertyTable?: {
    Properties?: Array<{
      SMILES?: string;
      ConnectivitySMILES?: string;
      CID?: number;
    }>;
  };
}

export const getSmiles = async (req: Request, res: Response) => {
  const { name } = req.query as { name?: string };

  if (!name) return res.status(400).json({ error: 'Drug name is required' });

  try {
    const response = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        name
      )}/property/SMILES/JSON`
    );

    const data = (await response.json()) as PubChemResponse;

    const smiles = data?.PropertyTable?.Properties?.[0]?.SMILES || null;

    if (!smiles) return res.status(404).json({ error: 'SMILES not found' });

    const savedDrug = await prisma.drug.upsert({
      where: { name },
      update: { smiles },
      create: { name, smiles },
    });

    return res.json({ name: savedDrug.name, smiles: savedDrug.smiles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch SMILES' });
  }
};
