import { PrismaClient } from "@prisma/client";

const axios = require("axios");

const prisma = new PrismaClient();

async function main() {
  /*
  const count = await prisma.usuario.create({
    data:{
      nome: 'Adson Barbosa de Souza',
      email: 'adson@4bi.com.br',
      senha: '123456',
    }
  })
  console.log(count);
  */

  const apiRes = await axios.get(`https://api.github.com/users/adsonb87`);

  const { login, avatar_url } = apiRes.data;

  console.log(apiRes.data);
  
}

main()
  .catch((e) => console.log(e))
  .finally(async () => await prisma.$disconnect());
