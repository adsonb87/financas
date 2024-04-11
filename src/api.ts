import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import "express-async-errors";
import { UsuarioRouter } from "./routes/usuarios";
import { TransacaoRouter } from "./routes/transacoes";
import { TagRouter } from "./routes/tags";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/usuarios", UsuarioRouter(prisma));
app.use("/tags", TagRouter(prisma));
app.use("/transacoes", TransacaoRouter(prisma));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({
    error: "Ocorreu um erro ao executar a api. " + err.message,
  });
});

const server = app.listen(3000, () => console.log("Acessando a porta 3000"));

const close = () => {
  server.close(async () => {
    console.log("Parando o serviço");
    await prisma.$disconnect();
  });
};

process.on("SIGINT", close);
