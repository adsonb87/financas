/*
  Warnings:

  - You are about to drop the `categorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "categorias";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TagToTransacao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagToTransacao_A_fkey" FOREIGN KEY ("A") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToTransacao_B_fkey" FOREIGN KEY ("B") REFERENCES "transacoes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_nome_key" ON "tags"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTransacao_AB_unique" ON "_TagToTransacao"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTransacao_B_index" ON "_TagToTransacao"("B");
