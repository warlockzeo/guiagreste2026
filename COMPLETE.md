# Guiagreste - Documentação Completa do Projeto

 

## Visão Geral do Projeto

 

Plataforma estilo Facebook para catálogo de marcas de roupas do agreste de Pernambuco, similar ao Moda Center (https://omodacenter.com.br/). Empresas publicam fotos como postagens e usuários podem seguir marcas e enviar mensagens.

 

## Stack Tecnológico

 

- **Frontend**: React 18 + Vite + TypeScript

- **Backend**: Express.js + SQLite

- **Estilização**: CSS Modules + Framer Motion

- **Gerenciamento de Estado**: Zustand

- **Comunicação**: Axios

 

---

 

## Estrutura de Pastas

 

```

Guiagreste/

├── server/                    # Backend (Express + SQLite)

│   ├── index.js              # Entry point do servidor

│   ├── db.js                 # Configuração do banco SQLite + seed

│   └── routes/

│       ├── auth.js           # Autenticação (login/register)

│       ├── brands.js         # Rotas de empresas e posts

│       ├── posts.js          # Feed de posts

│       ├── users.js          # Usuários e follows

│       └── conversations.js  # Mensagens/chat

│

├── shell/                     # Frontend (React)

│   ├── src/

│   │   ├── components/       # Componentes reutilizáveis

│   │   │   ├── Header.tsx    # Navigation header

│   │   │   ├── HeroCarousel.tsx

│   │   │   └── BrandCard.tsx

│   │   ├── pages/            # Páginas da aplicação

│   │   │   ├── Home.tsx      # Feed principal

│   │   │   ├── Catalog.tsx   # Catálogo de empresas

│   │   │   ├── BrandDetail.tsx

│   │   │   ├── Login.tsx

│   │   │   ├── Register.tsx

│   │   │   ├── Dashboard.tsx # Painel da empresa

│   │   │   ├── Messages.tsx

│   │   │   ├── Chat.tsx

│   │   │   └── MyFollows.tsx

│   │   ├── store/

│   │   │   └── authStore.ts  # Zustand store

│   │   ├── types/

│   │   │   └── index.ts       # TypeScript types

│   │   └── utils/

│   │       └── api.ts        # Axios instance

│   └── vite.config.ts        # Proxy config

```

 

---

 

## Funcionalidades Implementadas

 

### 1. Autenticação

- Login de usuários e empresas

- Cadastro de usuários comuns

- Cadastro de empresas (múltiplas categorias)

- Persistência com localStorage

 

### 2. Feed Principal (Home)

- Carrossel com últimas postagens

- Lista de posts estilo Facebook (1 por linha)

- Busca redireciona para catálogo com parâmetro ?search=X

- Filtro de categorias redireciona para catálogo (?category=X)

- Loading infinito

 

### 3. Catálogo de Empresas

- Grid de cards de marcas

- Busca por nome/descrição (?search=X)

- Filtro por categoria (?category=X)

- Ordenação por seguidores

 

### 4. Página da Empresa (BrandDetail)

- Header com logo e informações

- Contato (telefone, WhatsApp, email)

- Endereço e CNPJ

- Redes sociais (Instagram, Facebook, site)

- Categorias (múltiplos badges)

- Catálogo de produtos (posts)

- Loading infinito

- Botões Follow/Seguir

- Botão Mensagem

- Popup de zoom nas imagens (clique para ampliar)

 

### 5. Sistema de Seguidores

- Usuários podem seguir empresas

- Página "Minhas Seguidoras" (MyFollows)

- Exibição de marcas seguidas com categorias

 

### 6. Mensagens/Chat

- Lista de conversas

- Chat em tempo real

- Enviar mensagem para empresas

 

### 7. Dashboard da Empresa

- Estatísticas (produtos, mensagens)

- Criar novo produto (URL da imagem + descrição)

- Editar produto (descrição)

- Excluir produto

- Editar dados da empresa (nome, descrição, contato, redes sociais, múltiplas categorias com checkboxes)

- Botão para ver página pública

- Link para mensagens

 

### 8. Categorias

- Múltiplas categorias por empresa (checkboxes)

- Categorias disponíveis: Feminino, Masculino, Infantil, Acessórios, Calçados, Moda Praia, Esportivo, Jeans, Lingerie

- Posts não têm categorias (apenas empresas)

 

---

 

## Banco de Dados (SQLite)

 

### Tabelas:

 

1. **brands** - Empresas

   - id, name, email, password, phone, address, description, category (texto separado por vírgulas), logo, instagram, facebook, website, cnpj, whatsapp, createdAt

 

2. **users** - Usuários comuns

   - id, name, email, password, createdAt

 

3. **posts** - Produtos/Postagens das empresas

   - id, brandId, image, caption, category (deprecated), createdAt

 

4. **follows** - Seguidores

   - id, userId, brandId, createdAt

 

5. **conversations** - Conversas

   - id, userId, brandId, createdAt

 

6. **messages** - Mensagens

   - id, conversationId, senderId, senderType ('user' ou 'brand'), content, createdAt

 

7. **comments** - Comentários

   - id, userId, brandId, content, createdAt

 

### Seed Inicial

- 10 empresas do Moda Center Santa Cruz do Capibaribe

- 52 posts/products com imagens Unsplash

 

---

 

## Rotas da API

 

### GET /api/posts

Retorna feed de posts com paginação. Suporta parâmetros: page, limit, category, search.

 

### GET /api/brands

Lista marcas com filtros (search, category) e paginação.

 

### GET /api/brands/categories

Lista categorias únicas (extraídas de múltiplas categorias por empresa).

 

### GET /api/brands/:id

Detalhes de uma marca.

 

### PUT /api/brands/:id

Atualiza dados da empresa (campos dinâmicos - só atualiza os enviados).

 

### GET /api/brands/:id/posts

Posts de uma marca específica.

 

### POST /api/brands/:id/posts

Cria novo post (image, caption).

 

### PUT /api/brands/:id/posts/:postId

Edita post (caption).

 

### DELETE /api/brands/:id/posts/:postId

Deleta post.

 

### POST /api/auth/user/register

Cadastro de usuário.

 

### POST /api/auth/brand/register

Cadastro de empresa (enviar categories como string separada por vírgulas).

 

### POST /api/auth/login

Login (retorna user, token, type).

 

### POST /api/users/:id/follows

Seguir empresa (body: { brandId }).

 

### DELETE /api/users/:id/follows/:brandId

Deixar de seguir.

 

### GET /api/users/:id/follows

Lista de marcas seguidas.

 

### POST /api/conversations

Cria conversa (body: { userId, brandId }).

 

### GET /api/conversations/user/:id

Conversas do usuário.

 

### GET /api/conversations/:id/messages

Mensagens da conversa.

 

### POST /api/conversations/:id/messages

Envia mensagem (body: { senderId, senderType, content }).

 

---

 

## Configurações Importantes

 

### Proxy (Vite)

O frontend proxy para o backend:

- /api → http://localhost:3001

- /uploads → http://localhost:3001

 

### Axios

URL base: http://localhost:3001 (hardcoded como fallback)

 

---

 

## Como Rodar o Projeto

 

### 1. Instalar dependências

```bash

cd /home/warlockzeo/Guiagreste

npm install

cd shell && npm install

cd ../server && npm install

```

 

### 2. Iniciar servidor (porta 3001)

```bash

cd /home/warlockzeo/Guiagreste/server

node index.js

```

 

### 3. Iniciar frontend (porta 3000)

```bash

cd /home/warlockzeo/Guiagreste/shell

npm run dev

```

 

### 4. Acessar

- Frontend: http://localhost:3000

- Backend API: http://localhost:3001/api

- Health check: http://localhost:3001/health

 

---

 

## Observações Importantes

 

1. O banco SQLite é criado automaticamente ao iniciar o servidor

2. O seed de dados (10 empresas, 52 posts) é carregado na primeira execução

3. As imagens são URLs externas (Unsplash)

4. O sistema suporta tema claro/escuro (dark mode)

5. O header tem botão de alternância de tema

6. As empresas podem ter múltiplas categorias (separadas por vírgula no banco)

7. Posts não têm categoria - apenas descrição

8. O campo "category" nos posts ainda existe no banco mas não é usado

 

---

 

## Bugs Corrigidos

 

1. ✅ Feed não aparecia - Rota /api/posts criada

2. ✅ Carrossel 404 - Endpoint corrigido para /api/posts

3. ✅ API categories retornava categoria única - Agora extrai categorias de strings separadas por vírgula

4. ✅ Categorias no seed tinham categoria única - Agora suporte a múltiplas

5. ✅ Edição de empresa dava erro 500 - Query dinâmica implementado

6. ✅ Posts com categoria não funcionavam -API /api/posts filtra por brandCategory

7. ✅ Botão categoria não redirecionava - Agora navega para /catalog?category=X

8. ✅ Busca não redirecionava - Agora navega para /catalog?search=X

9. ✅ Indentação estranha no map de categorias - Corrigido

 

---

 

## Funcionalidades Planejadas Mas Não Implementadas

 

- Upload de imagens (servidor não tem pasta uploads/)

- Sistema de comentários

- Notificações

- Perfil do usuário comum

- Editar perfil do usuário

- Excluir conta

 

---

 

## Estado Atual

 

- **Backend**: ✅ Funcionando

- **Frontend**: ✅ Build passando

- **Database**: ✅ SQLite com seed

- **API**: ✅ Todas rotas implementadas