-- CreateTable
CREATE TABLE "public"."MoleculeGenerationHistory" (
    "id" SERIAL NOT NULL,
    "smiles" TEXT NOT NULL,
    "numMolecules" INTEGER NOT NULL,
    "minSimilarity" DOUBLE PRECISION NOT NULL,
    "particles" INTEGER NOT NULL,
    "iterations" INTEGER NOT NULL,
    "generatedMolecules" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoleculeGenerationHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MoleculeGenerationHistory" ADD CONSTRAINT "MoleculeGenerationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
