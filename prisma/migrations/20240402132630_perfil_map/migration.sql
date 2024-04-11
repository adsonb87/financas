/*
  Warnings:

  - You are about to drop the `Perfil` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Perfil";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "perfis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foto" BLOB,
    "usuarioId" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "perfis_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "perfis_usuarioId_key" ON "perfis"("usuarioId");
