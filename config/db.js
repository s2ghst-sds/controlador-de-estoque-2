 // Importa o módulo mongoose para interagir com o banco de dados MongoDB
const mongoose = require("mongoose");

// Carrega variáveis de ambiente a partir do arquivo .env
require("dotenv").config();

// Configura o mongoose para permitir consultas "strictQuery" (consultas mais restritas)
mongoose.set("strictQuery", true);

// Credenciais - NÃO COLOCAR DEIXAR PARA OS ALUNOS
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Função assíncrona para conectar ao banco de dados
async function main() {
  await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.oyzqut2.mongodb.net/estoquedecontrolador?retryWrites=true&w=majority&appName=Cluster0`
    // Link para o banco de dados, onde as credenciais de acesso como DBUSER e DBPASS
    // devem ser substituídas com as variáveis de ambiente ou informações adequadas.
  );

  // Exibe uma mensagem de sucesso caso a conexão seja estabelecida com sucesso
  console.log("Conectou ao banco de dados!");
}

// Chama a função main e, se ocorrer algum erro durante a conexão, exibe o erro no console
main().catch((err) => console.log(err));

// Exporta a função 'main' para ser utilizada em outras partes do código, se necessário
module.exports = main;