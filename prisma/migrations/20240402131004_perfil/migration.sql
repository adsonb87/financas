-- CreateTable
CREATE TABLE "Perfil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foto" BLOB,
    "usuarioId" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Perfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_usuarioId_key" ON "Perfil"("usuarioId");
