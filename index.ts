import axios from "axios";
import { promisify } from "util";
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const exists = promisify(fs.exists);
const stat = promisify(fs.stat);

// Definindo a estrutura dos dados retornados pela API
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  active: string;
  accessType: number;
  userType: UserType;
}

interface Unit {
  unit: UnitUser;
  linked: string;
}

interface UnitUser {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  unitType: UnitType;
}

interface UserAux {
  id: number;
  name: string;
  username: string;
  email: string;
  active: string;
  accessType: number;
  userType: UserType;
  phone: string;
  language: Language;
  country: Country;
  state: string;
  additionalFields: AdditionalFields[];
}

interface Language {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  name: string;
}

interface UnitType {
  id: number;
  name: string;
}

interface ApiResponse {
  data: User[];
  meta: {
    lastPage: number;
  };
}

interface AdditionalFields {
  id: number;
  name: string;
  type: number;
  order: number;
  options: [];
  charLimit: number;
  required: string;
  value: Value;
}

interface Value {
  text: string;
  date: string;
  value: string;
  optionId: string;
}

interface ApiResponseUnit {
  data: Unit[];
  meta: {
    lastPage: number;
  };
}

interface ApiResponseUserAux {
  data: UserAux;
}

async function carregaApi(page: number): Promise<ApiResponse> {
  // Defina o token de autenticação
  const token =
    "DUL4hcvzXzkEpD1qhRRQmJdweqkvMvBHHnLqvpC6YDPAtrNehQh5NBR38Uy4Vk3dmFp73xotzu7xtSYbIqUX3jd6kIU97Wrm8wTt2vziWLrENayb1E95tq3BDJEGSuRY";

  // Configuração da requisição
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //User type 29216 Supervisor - 29217 Coordenador
  // URL do endpoint
  const url =
    "https://integration.checklistfacil.com.br/v2/users?page=" +
    page +
    "&userTypeId=29217";

  try {
    // Fazendo a requisição GET
    const response = await axios.get(url, config);
    const { data, meta } = response.data;

    return {
      data: data, // Array de usuários
      meta: meta,
    };
  } catch (error) {
    console.error("Erro na requisição GET:", error);
    throw new Error("Erro na requisição GET");
  }
}

async function carregaApiCamposAuxiliares(
  id: number
): Promise<ApiResponseUserAux> {
  // Defina o token de autenticação
  const token =
    "DUL4hcvzXzkEpD1qhRRQmJdweqkvMvBHHnLqvpC6YDPAtrNehQh5NBR38Uy4Vk3dmFp73xotzu7xtSYbIqUX3jd6kIU97Wrm8wTt2vziWLrENayb1E95tq3BDJEGSuRY";

  // Configuração da requisição
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // URL do endpoint
  const url = "https://integration.checklistfacil.com.br/v2/users/" + id; //+"&userTypeId=29216";

  try {
    // Fazendo a requisição GET
    const response = await axios.get(url, config);
    const { ...data } = response.data;

    return {
      data: data,
    };
  } catch (error) {
    console.error("Erro na requisição GET:", error);
    throw new Error("Erro na requisição GET");
  }
}

async function unidadesUsuarios(id: number, page: number): Promise<any> {
  // Defina o token de autenticação
  const token =
    "DUL4hcvzXzkEpD1qhRRQmJdweqkvMvBHHnLqvpC6YDPAtrNehQh5NBR38Uy4Vk3dmFp73xotzu7xtSYbIqUX3jd6kIU97Wrm8wTt2vziWLrENayb1E95tq3BDJEGSuRY";

  // Configuração da requisição
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // URL do endpoint
  const url =
    "https://integration.checklistfacil.com.br/v2/users/" +
    id +
    "/units?linked=true&page=" +
    page;

  //setTimeout(async () => {
  try {
    // Fazendo a requisição GET
    const response = await axios.get(url, config);
    const { data, meta } = response.data;
    return {
      data: data, // Array de usuários
      meta: meta,
    };
  } catch (error) {
    console.error("Erro na requisição GET:", error);
    throw new Error("Erro na requisição GET");
  }
  //}, 2000);
}

async function usuarios(): Promise<User[]> {
  let pageUser = 1;
  let usuarios: User[] = [];
  let data: ApiResponse;

  do {
    console.log("****** Pagina: " + pageUser);
    data = await carregaApi(pageUser); // Aguardando a chamada assíncrona
    usuarios = usuarios.concat(data.data);
    console.log("****** Total de registros: " + usuarios.length);
    pageUser++;
  } while (pageUser <= data.meta.lastPage);

  return usuarios;
}

async function carregaTodasUnidades(userId: number): Promise<Unit[]> {
  var pageUni = 1;
  var unidades: Unit[] = [];
  var data: ApiResponseUnit;

  do {
    console.log("****** Pagina unidade: " + pageUni);
    data = await unidadesUsuarios(userId, pageUni);
    unidades = unidades.concat(data.data);
    console.log("****** Total de registros unidade: " + unidades.length);
    pageUni++;
  } while (pageUni <= data.meta.lastPage);

  return unidades;
}

async function montaInsert(dados: User, chapa: string, uni: Unit) {
  var id = dados.id || "";
  var name = dados.name || "";
  var userName = dados.username || "";
  var email = dados.email || "";
  var userTypeId = dados.userType.id || "";
  var userTypeName = dados.userType.name || "";
  var accessType = dados.accessType || "";
  var active = dados.active || "";
  var unitId = uni.unit.id || "";
  var unitName = uni.unit.name || "";
  var linked = uni.linked || "";
  // var unitTypeId = uni.unit.unitType.id || "";
  // var unitTypeName = uni.unit.unitType.name || "";
  var unitTypeId = uni.unit.unitType == null ? "" : uni.unit.unitType.id;
  var unitTypeName = uni.unit.unitType == null ? "" : uni.unit.unitType.name;
  var chapaUser = chapa || "";

  var insertUsuario =
    "INSERT INTO [toolbit].[dbo].[CLF_USUARIO_V2]" +
    "([codigo]" +
    ",[name]" +
    ",[username]" +
    ",[email]" +
    ",[userTypeId]" +
    ",[userTypeName]" +
    ",[accessType]" +
    ",[active]" +
    ",[additionalFields]" +
    ",[departments]" +
    ",[uni_id]" +
    ",[uni_nome]" +
    ",[linked]" +
    ",[uni_type_id]" +
    ",[uni_type_name]" +
    ",[chapa])" +
    "VALUES(" +
    id +
    "," +
    "'" +
    name +
    "'," +
    "'" +
    userName +
    "'," +
    "'" +
    email +
    "'," +
    userTypeId +
    "," +
    "'" +
    userTypeName +
    "'," +
    accessType +
    "," +
    "'" +
    active +
    "'," +
    "'" +
    "false" +
    "'," +
    "'" +
    "false" +
    "'," +
    +unitId +
    "," +
    "'" +
    unitName +
    "', " +
    "'" +
    linked +
    "', " +
    "'" +
    unitTypeId +
    "', " +
    "'" +
    unitTypeName +
    "', " +
    "'" +
    chapaUser +
    "')";

  //console.log(insertUsuario);

  await appendEmArquivoTxt(name, insertUsuario);

  //return insertUsuario;
}

async function appendEmArquivoTxt(
  nomeUsuario: string,
  conteudo: string
): Promise<void> {
  var nomeArquivo = `/Users/adsonsouza/Desktop/Inserts/Insert do usuario ${nomeUsuario}.txt`;
  //var nomeArquivo = `/Users/adsonsouza/Desktop/Inserts/Insert.txt`;

  // Verifica se o arquivo já existe
  const arquivoExiste = await exists(nomeArquivo);

  if (!arquivoExiste) {
    // Cria o arquivo se ele não existir
    await criarArquivo(nomeArquivo, conteudo);
  } else {
    // Verifica se o arquivo não está vazio e realiza o append
    const stats = await stat(nomeArquivo);

    if (stats.size > 0) {
      conteudo = `\n${conteudo}`;
    }
    await realizarAppend(nomeArquivo, conteudo);
  }
}

async function criarArquivo(
  nomeArquivo: string,
  conteudo: string
): Promise<void> {
  try {
    await writeFile(nomeArquivo, conteudo);
    console.log(`Arquivo ${nomeArquivo} criado com sucesso.`);
  } catch (err) {
    console.error("Erro ao criar o arquivo:", err);
  }
}

async function realizarAppend(
  nomeArquivo: string,
  conteudo: string
): Promise<void> {
  try {
    await appendFile(nomeArquivo, conteudo);
    console.log(`Append realizado com sucesso em ${nomeArquivo}.`);
  } catch (err) {
    console.error("Erro ao realizar append no arquivo:", err);
  }
}

async function processarUsuarios() {
  var usuario: User = {
    id: 0,
    name: "",
    username: "",
    email: "",
    active: "",
    accessType: 0,
    userType: {
      id: 0,
      name: "",
    },
    // Incluir outras propriedades conforme necessário
  };

  var chapa: string = "";
  var units: Unit[] = [];

  try {
    var users: User[] = await usuarios();

    for (var i = 0; i < users.length; i++) {
      usuario = users[i];

      if (
        usuario.id != 454512 &&
        usuario.id != 257562 &&
        usuario.id != 257574 &&
        usuario.id != 473805 &&
        usuario.id != 327372 &&
        usuario.id != 342804 &&
        usuario.id != 452712 &&
        usuario.id != 257516 &&
        usuario.id != 257524
      ) {
        chapa = (await carregaApiCamposAuxiliares(usuario.id)).data
          .additionalFields[0].value.text;

        units = await carregaTodasUnidades(usuario.id);

        for (var j = 0; j < units.length; j++) {
          await montaInsert(usuario, chapa, units[j]);
          //appendEmArquivoTxt(usuario.name, insert);
        }
      }
    }
  } catch (error) {
    console.error("error: ", error);
  }
}

processarUsuarios();
