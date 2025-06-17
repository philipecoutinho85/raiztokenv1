# Plataforma $RAIZ

## Visão Geral

A plataforma $RAIZ tem como missão potencializar projetos de impacto social em comunidades reais, usando tokenização digital para aumentar o engajamento da população, facilitar a prestação de contas e transparência, permitir que prefeituras e apoiadores invistam em ações concretas com rastreabilidade, e criar um ecossistema onde cada apoio gera valor simbólico e reputacional (via tokens).

## Arquitetura

A plataforma é construída como uma aplicação web moderna, utilizando:

*   **Frontend:** React com Vite para desenvolvimento rápido e Tailwind CSS para estilização, garantindo um design `mobile-first` e responsivo.
*   **Backend & Banco de Dados:** Supabase, que oferece um banco de dados PostgreSQL, autenticação de usuários (Supabase Auth) e APIs RESTful para interação com os dados.

## Configuração do Ambiente

Para configurar e executar o projeto localmente, siga os passos abaixo:

### 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   Node.js (versão 18 ou superior)
*   pnpm (gerenciador de pacotes)
*   Git

### 2. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd raiz-platform
```

### 3. Configurar o Supabase

1.  Crie um novo projeto no [Supabase](https://supabase.com/).
2.  No painel do seu projeto Supabase, vá em `Settings > API`.
3.  Copie a `Project URL` e a `Anon Public Key`.
4.  Crie um arquivo `.env` na raiz do projeto `raiz-platform` (ao lado do `package.json`) com o seguinte conteúdo, substituindo os valores pelos seus:

    ```
    VITE_SUPABASE_URL=sua_project_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_anon_public_key_do_supabase
    ```

5.  **Configurar o Banco de Dados no Supabase:**
    *   Vá para `Table Editor` no seu projeto Supabase.
    *   Crie as tabelas `usuarios`, `projetos` e `apoios` conforme o esquema detalhado no arquivo `architecture_plan.md`.
    *   Configure as políticas de Row Level Security (RLS) para cada tabela, garantindo que os usuários tenham as permissões adequadas (leitura, escrita, atualização) apenas em seus próprios dados, e que administradores tenham acesso total quando necessário.

### 4. Instalar Dependências

No diretório `raiz-platform`, execute:

```bash
pnpm install
```

### 5. Executar a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev --host
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Estrutura do Projeto

```
raiz-platform/
├── public/
├── src/
│   ├── assets/             # Ativos estáticos (imagens, etc.)
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── ui/             # Componentes de UI (shadcn/ui)
│   │   └── Layout.jsx      # Layout principal da aplicação
│   ├── contexts/           # Contextos React (ex: AuthContext)
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── lib/                # Funções utilitárias e configurações
│   │   └── supabase.js     # Configuração do cliente Supabase
│   ├── pages/              # Páginas da aplicação (rotas)
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── ... (outras páginas)
│   ├── App.css             # Estilos globais e Tailwind CSS
│   ├── App.jsx             # Componente principal com roteamento
│   └── main.jsx            # Ponto de entrada da aplicação
├── .env.example            # Exemplo de variáveis de ambiente
├── .env                    # Variáveis de ambiente locais (não versionado)
├── package.json            # Dependências e scripts do projeto
├── pnpm-lock.yaml          # Lock file do pnpm
├── vite.config.js          # Configuração do Vite
└── README.md               # Este arquivo
```

## Funcionalidades Implementadas (Fases 1-3)

*   **Autenticação:**
    *   Login de usuário (`/login`)
    *   Registro de novo usuário (`/register`)
    *   Redefinição de senha (`/reset-password`)
    *   Lógica de sessão e proteção de rotas.
*   **Estrutura Base:**
    *   Layout `mobile-first` com navegação superior.
    *   Página de Dashboard inicial.
    *   Integração com Supabase para autenticação e dados.

## Próximas Etapas

Consulte o arquivo `todo.md` para as próximas etapas de desenvolvimento.


