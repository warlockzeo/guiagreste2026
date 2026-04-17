# Guiagreste

Plataforma estilo Facebook para catálogo de marcas de roupas do agreste de Pernambuco, inspirado no Moda Center Santa Cruz do Capibaribe.

## Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + SQLite (sql.js)
- **State Management**: Zustand
- **Styling**: CSS Modules + CSS Variables
- **Animations**: Framer Motion
- **HTTP Client**: Axios

## Arquitetura

```
Guiagreste/
├── server/                    # Backend (Express + SQLite)
│   ├── index.js              # Entry point (porta 3001)
│   ├── db.js                 # Database + seed
│   ├── routes/               # API Routes
│   │   ├── auth.js
│   │   ├── brands.js
│   │   ├── posts.js
│   │   ├── users.js
│   │   ├── conversations.js
│   │   └── upload.js
│   └── uploads/              # Imagens carregadas
│
├── shell/                     # Frontend (React)
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # Tipos TypeScript
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitários
│   └── public/             # Arquivos estáticos
│
├── COMPLETE.md               # Requisitos completos
├── DIAGRAMS.md               # Diagramas de arquitetura
└── README.md
```

## Funcionalidades

- Feed de postagens com carrossel de imagens
- Catálogo de empresas com busca e filtros por categoria
- Infinite scroll no catálogo
- Sistema de seguidores
- Chat/mensagens com marcas
- Dashboard para empresas (gerenciar posts e perfil)
- Upload de imagens
- Tema claro/escuro com toggle
- Autenticação (usuários e empresas)
- Página pública de marca com informações de contato
- Toast notifications

## Categorias

Feminino | Masculino | Infantil | Acessórios | Calçados | Moda Praia | Esportivo | Jeans | Lingerie

## Como Rodar

### 1. Instalar dependências

```bash
# Backend
cd server && npm install

# Frontend
cd shell && npm install
```

### 2. Iniciar servidor (porta 3001)

```bash
cd server && npm start
```

### 3. Iniciar frontend (porta 5173)

```bash
cd shell && npm run dev
```

### 4. Acessar

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/health

## Usuário de Teste

```bash
# Usuário comum
Email: usuario@teste.com
Senha: 123456

# Empresas (exemplo)
Email: contato@vanessamodas.com.br
Senha: 123456
```

## Scripts

### Frontend (shell)

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
```

### Backend (server)

```bash
npm start            # Iniciar servidor
```

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/user/register` | Cadastro de usuário |
| POST | `/api/auth/brand/register` | Cadastro de empresa |
| POST | `/api/auth/login` | Login |

### Marcas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/brands` | Lista marcas (query: search, category, limit, page) |
| GET | `/api/brands/categories` | Lista categorias |
| GET | `/api/brands/:id` | Detalhes da marca |
| PUT | `/api/brands/:id` | Atualiza marca |
| GET | `/api/brands/:id/posts` | Posts da marca |
| POST | `/api/brands/:id/posts` | Criar post |
| PUT | `/api/brands/:id/posts/:postId` | Editar post |
| DELETE | `/api/brands/:id/posts/:postId` | Deletar post |
| GET | `/api/brands/:id/followers` | Lista seguidores |

### Posts

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/posts` | Feed de posts (query: limit, page, category) |

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users/:id/follows` | Lista marcas seguidas |
| POST | `/api/users/:id/follows` | Seguir marca |
| DELETE | `/api/users/:id/follows/:brandId` | Deixar de seguir |

### Conversas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/conversations` | Criar conversa |
| GET | `/api/conversations/user/:id` | Conversas do usuário |
| GET | `/api/conversations/brand/:id` | Conversas da empresa |
| GET | `/api/conversations/:id/messages` | Mensagens |
| POST | `/api/conversations/:id/messages` | Enviar mensagem |

### Upload

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/upload` | Upload de imagem |

## Design System

### Cores

| Nome | Hex | Uso |
|------|-----|-----|
| Laranja | `#f97316` | Cor primária, CTAs, destaques |
| Laranja Escuro | `#ea580c` | Hover states |
| Preto | `#000000` | Textos, elementos gráficos |
| Cinza | `#808080` | Textos secundários |
| Branco | `#ffffff` | Backgrounds, cards |

### Tema

- **Light mode** (padrão)
- **Dark mode** (toggle no header)

### CSS Variables

```css
--color-orange: #f97316;
--color-orange-dark: #ea580c;
--color-black: #000000;
--color-gray: #808080;
--color-white: #ffffff;
```

### Tipografia

- Fonte: `Inter, sans-serif`
- Escala: xs, sm, base, lg, xl, 2xl

## Banco de Dados

SQLite (sql.js) com seed de dados:

- 10 empresas do Moda Center Santa Cruz
- ~50 posts/produtos com imagens Unsplash
- 1 usuário de teste

### Tabelas

- `users` - Usuários comuns
- `brands` - Empresas/marcas
- `posts` - Posts/produtos
- `follows` - Relacionamento seguindo
- `conversations` - Conversas
- `messages` - Mensagens
- `user_interests` - Interesses do usuário

## Estrutura de Diretórios Frontend

```
shell/src/
├── components/
│   ├── Header.tsx           # Header com menu dropdown
│   ├── BrandCard.tsx        # Card de marca
│   ├── PostCard.tsx         # Card de post
│   ├── ImageUpload.tsx      # Upload de imagens
│   └── Toast.tsx           # Notificações
├── pages/
│   ├── Home.tsx             # Página inicial com feed
│   ├── Catalog.tsx          # Catálogo com filtros
│   ├── BrandDetail.tsx      # Página da marca
│   ├── Dashboard.tsx        # Painel da empresa
│   ├── Login.tsx            # Login
│   ├── Register.tsx         # Cadastro
│   └── Messages.tsx         # Mensagens
├── store/
│   ├── authStore.ts         # Estado de autenticação
│   ├── toastStore.ts        # Estado de notificações
│   └── themeStore.ts        # Estado do tema
├── types/
│   └── index.ts             # Tipos TypeScript
├── hooks/
│   └── useUpload.ts         # Hook de upload
└── utils/
    └── api.ts               # Configuração Axios
```

## Licença

MIT
