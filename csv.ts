import { log } from "console";
import { createReadStream } from "fs";
import { createInterface } from "readline";

async function carregarTransacoes() {
  const csv = createInterface({
    input: createReadStream("gastos.csv"),
  });

  for await (const linha of csv) {
    const tx = linha.split(",");
    const transacao = {
      titulo: tx[9],
      descricao: tx[9],
      valor: parseFloat(tx[13]),
      tipo: 2,
      usuarioId: 1,
      tag: [
        {
          nome: tx[8],
        },
      ],
    };
    console.log(transacao);
  }
}

carregarTransacoes();
