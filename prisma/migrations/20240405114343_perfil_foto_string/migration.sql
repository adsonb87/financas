-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_perfis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foto" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "perfis_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_perfis" ("atualizadoEm", "criadoEm", "foto", "id", "usuarioId") SELECT "atualizadoEm", "criadoEm", "foto", "id", "usuarioId" FROM "perfis";
DROP TABLE "perfis";
ALTER TABLE "new_perfis" RENAME TO "perfis";
CREATE UNIQUE INDEX "perfis_usuarioId_key" ON "perfis"("usuarioId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
