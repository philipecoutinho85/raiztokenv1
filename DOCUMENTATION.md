# Plataforma $RAIZ - Documentação Final

## Visão Geral

A plataforma $RAIZ é uma aplicação web completa para potencializar projetos de impacto social através de tokenização digital. A plataforma permite que usuários criem propostas de projetos, apoiem iniciativas com tokens digitais, e facilita a gestão transparente de recursos para impacto social.

## Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **Login** (`/login`): Autenticação por e-mail e senha
- **Registro** (`/registro`): Cadastro completo com dados pessoais e endereço
- **Redefinição de Senha** (`/reset-password`): Recuperação de senha via e-mail
- **Proteção de Rotas**: Sistema de autenticação integrado com Supabase Auth

### 👤 Gestão de Perfil
- **Página de Perfil** (`/perfil`): Edição de informações pessoais
- **Upload de Foto**: Alteração de foto de perfil com armazenamento no Supabase Storage
- **Atualização de Dados**: Edição de endereço e informações de contato

### 📊 Dashboard Principal
- **Exibição de Projetos**: Grid de cards estilo Airbnb com projetos aprovados
- **Estatísticas do Usuário**: Tokens disponíveis, projetos criados e apoiados
- **Sistema de Apoio**: Funcionalidade para apoiar projetos com tokens
- **Progresso Visual**: Barras de progresso e indicadores de meta atingida

### 📝 Criação de Projetos
- **Formulário Completo** (`/criar`): Criação de propostas com todos os campos necessários
- **Upload de Imagens**: Suporte a imagens de capa para projetos
- **Status de Aprovação**: Sistema de aprovação por administradores

### ⚙️ Painel Administrativo
- **Acesso Restrito** (`/admin`): Apenas para usuários com role de administrador
- **Gestão de Usuários**: Listagem, busca, promoção e banimento de usuários
- **Gestão de Propostas**: Aprovação/rejeição de projetos com justificativas
- **BigNumbers**: Estatísticas gerais da plataforma
- **Interface Tabular**: Organização em abas para usuários e propostas

### 🌐 Explorer Público
- **Página Pública** (`/explorer`): Acesso sem necessidade de login
- **Filtros Avançados**: Busca por texto, bairro e status do projeto
- **Estatísticas Públicas**: Visão geral dos projetos ativos e concluídos
- **Call-to-Action**: Incentivo ao cadastro para apoiar projetos

## Arquitetura Técnica

### Frontend
- **React 19** com Vite para desenvolvimento rápido
- **Tailwind CSS** para estilização responsiva mobile-first
- **shadcn/ui** para componentes de interface consistentes
- **React Router DOM** para navegação entre páginas
- **Lucide React** para ícones modernos

### Backend e Banco de Dados
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** para persistência de dados
- **Supabase Auth** para autenticação de usuários
- **Supabase Storage** para armazenamento de arquivos
- **Row Level Security (RLS)** para controle de acesso

### Estrutura do Banco de Dados

#### Tabela `usuarios`
- Informações pessoais completas
- Sistema de roles (user/admin)
- Controle de banimento
- Tokens disponíveis

#### Tabela `projetos`
- Dados completos do projeto
- Sistema de status (pendente/aprovado/rejeitado)
- Metas e prazos
- Justificativas de rejeição

#### Tabela `apoios`
- Registro de apoios com tokens
- Relacionamento usuário-projeto
- Histórico de transações

## Funcionalidades de Destaque

### 🎨 Design e UX
- **Mobile-First**: Layout responsivo otimizado para dispositivos móveis
- **Estilo Airbnb**: Cards visuais atraentes com informações organizadas
- **Navegação Intuitiva**: Menu superior fixo com acesso rápido às funcionalidades
- **Feedback Visual**: Alertas, loaders e indicadores de progresso

### 🔒 Segurança
- **Autenticação Robusta**: Integração com Supabase Auth
- **Proteção de Rotas**: Verificação de autenticação e autorização
- **Validação de Dados**: Validações no frontend e backend
- **Controle de Acesso**: Sistema de roles para administradores

### 📱 Responsividade
- **Grid Adaptativo**: Layouts que se ajustam a diferentes tamanhos de tela
- **Componentes Flexíveis**: Interface otimizada para desktop e mobile
- **Navegação Mobile**: Menu colapsível para dispositivos móveis

## Fluxo de Usuário

### Para Usuários Comuns
1. **Cadastro/Login**: Acesso à plataforma
2. **Explorar Projetos**: Visualização no dashboard ou explorer
3. **Apoiar Projetos**: Doação de tokens para iniciativas
4. **Criar Projetos**: Submissão de propostas para aprovação
5. **Gerenciar Perfil**: Atualização de dados pessoais

### Para Administradores
1. **Acesso ao Painel**: Login com role de admin
2. **Revisar Propostas**: Aprovação ou rejeição de projetos
3. **Gerenciar Usuários**: Promoção e controle de acesso
4. **Monitorar Estatísticas**: Acompanhamento da plataforma

## Configuração e Deploy

### Requisitos
- Node.js 18+
- Conta no Supabase
- Variáveis de ambiente configuradas

### Instalação
```bash
git clone <repositorio>
cd raiz-platform
pnpm install
```

### Configuração
1. Criar projeto no Supabase
2. Configurar tabelas conforme esquema
3. Definir variáveis de ambiente
4. Executar `pnpm run dev`

### Deploy
A aplicação está pronta para deploy em plataformas como:
- Vercel
- Netlify
- AWS Amplify

## Próximos Passos

### Melhorias Futuras
- Sistema de notificações em tempo real
- Integração com métodos de pagamento
- Dashboard de analytics avançado
- Sistema de comentários em projetos
- API pública para integrações

### Escalabilidade
- Implementação de cache
- Otimização de queries
- CDN para assets
- Monitoramento de performance

## Conclusão

A plataforma $RAIZ foi desenvolvida com foco na experiência do usuário, segurança e escalabilidade. Todas as funcionalidades especificadas foram implementadas com tecnologias modernas e melhores práticas de desenvolvimento. A arquitetura permite fácil manutenção e expansão futura da plataforma.

O projeto está pronto para produção e pode ser facilmente configurado em qualquer ambiente com as instruções fornecidas no README.md.

