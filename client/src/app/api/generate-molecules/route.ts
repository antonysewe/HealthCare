import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const API_KEY = "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";
    const invokeUrl = "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";

    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to generate molecules" }, { status: response.status });
    }

    const data = await response.json();

    // Parse molecules safely
    const generatedMolecules = (typeof data.molecules === "string"
      ? JSON.parse(data.molecules)
      : data.molecules
    ).map((mol: any) => ({
      structure: mol.sample,
      score: mol.score,
    }));

    return NextResponse.json({ molecules: generatedMolecules });
  } catch (err) {
    console.error("Error calling Nvidia API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
