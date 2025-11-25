import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from "zod";


const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });

const clarifyResearchGoals = async (topic: string) => {

    const prompt = `
        You are assisting a molecular researcher. The user provided the topic:
        <topic>${topic}</topic>

        Your task has two parts:

        --------------------------
        1) Generate 2-4 clarifying questions
        --------------------------

        Ask only what is necessary to identify their real scientific goal.

        Focus your questions on:
        - Whether they want molecule analysis or molecule generation
        - Any missing structural info (SMILES, SDF, PDB, target protein)
        - Type of research task (binding, ADMET, docking, toxicity, pathway, etc.)
        - The desired output (workflow steps, predictions, visualization, or a generated molecule)

        Keep questions concise, technical, and research-oriented.

        --------------------------
        2) Detect if the user wants a SMILES string
        --------------------------

        If the user's intent includes:
        - generating a molecule,
        - proposing a candidate compound,
        - modifying an existing molecule,
        - asking for an example small molecule,
        - exploring analogs or scaffolds,

        THEN you must:
        - provide a chemically valid SMILES string,
        - ensure the molecule is drug-like unless instructed otherwise,
        - keep the SMILES as your final line.

        If the user is NOT asking for a molecule or structure, only generate the clarifying questions.

        Do NOT invent biology that violates chemistry rules.
        Do NOT generate random invalid SMILES.

        --------------------------
        Output format:
        - First: the clarifying questions
        - Second (only when relevant): the SMILES string
    `

    try{
        const { object } = await generateObject({
            model: openrouter("meta-llama/llama-3.3-70b-instruct"),
            prompt,
            schema: z.object({
                questions: z.array(z.string())
            })
          });

          return object.questions;
    }catch(error){
    console.log("Error while generating questions: ", error)

    }
}


export async function POST(req: Request){

    const {topic} = await req.json();
    console.log("Topic: ", topic);

    try{
           const questions = await clarifyResearchGoals(topic);
           console.log("Questions: ", questions)

           return NextResponse.json(questions)
    }catch(error){

       console.error("Error while generating questions: ", error)
        return NextResponse.json({
            success: false, error: "Failed to generate questions"
        }, {status: 500})

    }


   
}