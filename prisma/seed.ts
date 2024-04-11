import { PrismaClient } from "@prisma/client";
import { createReadStream } from "fs";
import { createInterface } from "readline";

const prisma = new PrismaClient();

//Lê as informações de um csv e popula o banco
async function carregarTransacoes() {
  let txId = 0;

  const csv = createInterface({
    input: createReadStream("gastos.csv"),
  });

  for await (const linha of csv) {
    const tx = linha.split(",");
    const transacao = {
      id: txId++,
      titulo: tx[9],
      descricao: tx[9],
      valor: parseFloat(tx[13]),
      tipo: 2,
      usuarioId: 1,
      tag: {
        nome: tx[8],
      },
    };

    await prisma.transacao.upsert({
      where: { id: transacao.id },
      update: {},
      create: {
        id: transacao.id,
        titulo: transacao.titulo,
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipo: transacao.tipo,
        usuarioId: transacao.usuarioId,
        tags: {
          connectOrCreate: {
            where: {
              nome: transacao.tag.nome,
            },
            create: {
              nome: transacao.tag.nome,
            },
          },
        },
      },
    });
  }
}

async function popularBanco() {
  const usuarioPadrao = await prisma.usuario.upsert({
    where: {
      email: "usario@email.com",
    },
    update: {},
    create: {
      email: "usario@email.com",
      nome: "Padrão",
      senha: "123456",
      perfil: {
        create: {
          foto: "foto",
        },
      },
    },
  });
  await carregarTransacoes();
}

popularBanco()
  .catch((err) => console.log(err))
  .finally(async () => {
    prisma.$disconnect();
  });
