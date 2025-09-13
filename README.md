# StockCtrl – Sistema de Controle de Estoque

Sistema completo para gestão de estoque de produtos, com backend Node.js/Express/MongoDB e frontend HTML/CSS/JS. Permite cadastro, listagem, edição, exclusão de produtos, upload de imagens, autenticação de usuários e alertas automáticos por e-mail.

---

## Sumário

- Visão geral
- Estrutura de pastas e arquivos
- Requisitos
- Configuração (.env)
- Instalação e execução
- Endpoints da API
- Fluxo de funcionamento

---

## Visão geral

- **Backend (Node.js/Express/Mongoose):** API REST para produtos, imagens, usuários e autenticação.
- **Frontend (HTML/CSS/JS):** Interface para cadastro, visualização, edição e exclusão de produtos.
- **Armazenamento:** MongoDB Atlas, modelos para produtos, imagens e usuários.
- **Alertas automáticos:** E-mails para estoque baixo e validade próxima/vencida.
- **Autenticação:** Registro e login de usuários com JWT.

---

## Estrutura de pastas e arquivos

```
controlador-de-estoque-2/
│
├── ctrl.js                  # Ponto de entrada do servidor Express
├── package.json             # Dependências e scripts
├── .env                     # Variáveis de ambiente (não versionado)
│
├── config/
│   ├── db.js                # Conexão com MongoDB
│   ├── multer.js            # Configuração de upload de imagens
│   └── email.js             # Configuração do Nodemailer
│
├── models/
│   ├── Ctrl.js              # Schema/modelo de produto
│   ├── Picture.js           # Schema/modelo de imagem
│   └── UserModel.js         # Schema/modelo de usuário
│
├── controllers/
│   ├── Ctrlcontroller.js    # Lógica de produto (CRUD, alertas)
│   ├── PictureController.js # Lógica de imagem (CRUD)
│   ├── authController.js    # Registro/login de usuário
│   ├── userController.js    # Consulta de usuário
│   └── emailController.js   # Envio de e-mails
│
├── routes/
│   ├── ctrlRoutes.js        # Rotas de produto
│   ├── picture.js           # Rotas de imagem
│   ├── authRoutes.js        # Rotas de autenticação
│   ├── userRoutes.js        # Rotas de usuário
│   └── emailRoutes.js       # Rotas de e-mail
│
├── middlewares/
│   └── authMiddleware.js    # Middleware de autenticação JWT
│
├── public/
│   ├── css/
│   │   ├── index.css        # Estilos da página inicial
│   │   ├── ctrl.css         # Estilos da página de controle de estoque
│   │   └── auth.css         # Estilos de login/cadastro
│   ├── js/
│   │   ├── main.js          # Lógica do frontend (produtos)
│   │   └── auth.js          # Lógica do frontend (login/cadastro)
│   └── views/
│       ├── index.html       # Página inicial
│       ├── ctrl.html        # Página de controle de estoque
│       ├── login.html       # Página de login
│       └── register.html    # Página de cadastro
│
├── uploads/                 # Imagens enviadas (expostas via /uploads)
```

---

## O que faz cada arquivo

- **ctrl.js:** Inicializa o servidor, configura rotas, serve arquivos estáticos.
- **config/db.js:** Conecta ao MongoDB usando variáveis do .env.
- **config/multer.js:** Define como imagens são recebidas e salvas.
- **config/email.js:** Configura transporte de e-mail via Nodemailer.
- **models/Ctrl.js:** Modelo de produto (nome, descrição, categoria, preços, validade, quantidade, imagem).
- **models/Picture.js:** Modelo de imagem (nome, caminho do arquivo).
- **models/UserModel.js:** Modelo de usuário (nome, e-mail, senha).
- **controllers/Ctrlcontroller.js:** CRUD de produtos, alertas automáticos por e-mail.
- **controllers/PictureController.js:** CRUD de imagens.
- **controllers/authController.js:** Registro e login de usuários.
- **controllers/userController.js:** Consulta de dados do usuário.
- **controllers/emailController.js:** Envio de e-mails (registro, alerta).
- **routes/ctrlRoutes.js:** Rotas para produtos (CRUD, filtro por categoria).
- **routes/picture.js:** Rotas para imagens (upload, listagem, remoção).
- **routes/authRoutes.js:** Rotas para registro/login.
- **routes/userRoutes.js:** Rotas para consulta de usuário (pública/privada).
- **routes/emailRoutes.js:** Rotas para envio de e-mail.
- **middlewares/authMiddleware.js:** Middleware para proteger rotas privadas via JWT.
- **public/views/index.html:** Página inicial, lista de produtos.
- **public/views/ctrl.html:** Página de controle de estoque (CRUD completo).
- **public/views/login.html:** Página de login.
- **public/views/register.html:** Página de cadastro.
- **public/js/main.js:** Lógica JS para listar, filtrar e exibir produtos.
- **public/js/auth.js:** Lógica JS para login/cadastro.
- **public/css/index.css, ctrl.css, auth.css:** Estilos das páginas.
- **uploads/:** Pasta onde imagens são salvas.

---

## Requisitos

- Node.js (>= 18 recomendado)
- Conta no MongoDB Atlas (ou MongoDB local)
- Configuração SMTP para envio de e-mails

---

## Configuração (.env)

Crie um arquivo `.env` na raiz com:

```
DB_USER=seuUsuarioMongo
DB_PASS=suaSenhaMongo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seuEmail@gmail.com
SMTP_PASS=suaSenhaApp
SMTP_FROM="stockctrl<seuEmail@gmail.com>"
PORT=8080
SECRET=suaChaveSecretaJWT
```

---

## Instalação e execução

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o backend:
   ```bash
   npm start
   ```
   O servidor estará disponível na porta definida no `.env` (padrão 8080).

3. Acesse o frontend:
   - Abra `public/views/index.html` ou acesse via navegador em `http://localhost:8080/`.

---

## Endpoints da API

- **Produtos**
  - `GET /produtos` — Lista todos os produtos
  - `POST /produtos` — Adiciona novo produto (form-data, inclui imagem)
  - `PUT /produtos/:id` — Atualiza produto
  - `DELETE /produtos/:id` — Remove produto
  - `GET /produtos/categoria/:categoria` — Filtra produtos por categoria

- **Imagens**
  - `POST /pictures` — Upload de imagem
  - `GET /pictures` — Lista imagens
  - `DELETE /pictures/:id` — Remove imagem

- **Usuários**
  - `POST /auth/register` — Cadastro de usuário
  - `POST /auth/login` — Login (retorna JWT)
  - `GET /user/public/:id` — Consulta pública de usuário
  - `GET /user/private/:id` — Consulta privada (JWT obrigatório)

- **E-mail**
  - `POST /registrar` — Registro e envio de e-mail de boas-vindas
  - `POST /enviar-email` — Envio de e-mail personalizado

---

## Fluxo de funcionamento

1. Usuário acessa o sistema e faz login/cadastro.
2. Após login, pode cadastrar, editar, remover produtos e enviar imagens.
3. Produtos são exibidos com imagem, categoria, preços, validade e quantidade.
4. Alertas automáticos por e-mail são enviados para estoque baixo ou validade próxima/vencida.
5. Imagens são salvas na pasta `uploads/` e referenciadas nos produtos.
6. Todas as operações CRUD são protegidas por autenticação JWT.

---

## Exemplos de uso via curl

```bash
# Listar produtos
curl http://localhost:8080/produtos

# Adicionar produto (form-data)
curl -X POST http://localhost:8080/produtos \
  -F nome="Chá Verde" \
  -F desc="Chá premium" \
  -F categoria="Chá" \
  -F precocompra=10 \
  -F precovenda=20 \
  -F validade="2025-12-31" \
  -F qntd=50 \
  -F file=@caminho/para/imagem.jpg

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"senha"}'
```

---

## Observações

- Para produção, configure variáveis de ambiente seguras e SMTP válido.
- O frontend pode ser servido por qualquer servidor estático ou pelo próprio Express.
- Para rotas privadas, inclua o token JWT no header: `Authorization: Bearer <token>`.
