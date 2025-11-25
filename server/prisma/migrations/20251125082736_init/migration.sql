-- CreateTable
CREATE TABLE "public"."Molecule" (
    "id" SERIAL NOT NULL,
    "moleculeName" TEXT NOT NULL,
    "smilesStructure" TEXT NOT NULL,
    "molecularWeight" DOUBLE PRECISION NOT NULL,
    "categoryUsage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Molecule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Molecule_smilesStructure_key" ON "public"."Molecule"("smilesStructure");
