-- CreateTable
CREATE TABLE "public"."Drug" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "smiles" TEXT NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drug_name_key" ON "public"."Drug"("name");
