# **CHANGELOG.md**

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue as convenções de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto segue [SemVer](https://semver.org/lang/pt-BR/).

---
## [Unreleased]
### **✨ Added**

- (exemplo) Novo endpoint para autenticação com refresh token.

### **🛠️ Changed**

- (exemplo) Melhorada a performace do endpoint.

### **🐛 Fixed**

- (exemplo) Corrigido bug de valização de CPF cadastro de usuário.

### **⚠️ Deprecated**

- (exemplo) Endpoint '/old-login' marcado como obsoleto.

### **❌ Removed**

- (exemplo) Endpoint '/legacy-report' removido. 

### **🛑 Security**

- (exemplo) atualização dependencia do jwttoken para corrigir vuklnerabilidade

---

# **[1.3.0]- 2026-01-16**

### **✨ Added**

- Novos campos `usuario_id` e `role_art` na tabela `articles` para suporte a artigos criados por clientes.
- Nova tabela `news` no banco de dados com campos `usuario_id` e `role_art` para notícias de clientes.
- Sistema completo de gerenciamento de notícias (news) para clientes com CRUD completo.
- Novos endpoints para clientes gerenciarem seus próprios artigos (`POST /api/client/articles`, `GET /api/client/articles`, `GET /api/client/articles/:id`, `PUT /api/client/articles/:id`, `DELETE /api/client/articles/:id`, `POST /api/client/articles/delete-many`).
- Novos endpoints para clientes gerenciarem suas próprias notícias (`POST /api/client/news`, `GET /api/client/news`, `GET /api/client/news/:id`, `PUT /api/client/news/:id`, `DELETE /api/client/news/:id`, `POST /api/client/news/delete-many`).
- Use cases para operações de client articles: `CreateClientArticleUseCase`, `UpdateClientArticleUseCase`, `FindClientArticleByIdUseCase`, `FindClientArticlesByUserIdUseCase`, `DeleteClientArticleUseCase`, `DeleteManyClientArticlesUseCase`.
- Use cases para operações de news: `CreateNewsUseCase`, `UpdateNewsUseCase`, `FindNewsByIdUseCase`, `FindNewsByUserIdUseCase`, `DeleteNewsUseCase`, `DeleteManyNewsUseCase`.
- DTOs para news: `CreateNewsDto`, `UpdateNewsDto`, `DeleteManyNewsDto`.
- DTO `DeleteManyArticlesDto` para exclusão múltipla de artigos.
- Controller `ClientArticlesController` para rotas de artigos de clientes.
- Controller `NewsController` para rotas de notícias de clientes.
- Service `NewsService` para orquestração de operações de notícias.
- Repository `NewsRepository` com métodos CRUD e busca por usuário.
- Model Sequelize `News` com associações configuradas.
- Módulo `NewsModule` configurado com todas as dependências.
- Enum `RoleEnum` com valores ROOT (1), ADMIN (2), CLIENT (3) e função helper `getRoleArtFromString()` para conversão de string para número.
- Migrações SQL para adicionar campos `usuario_id` e `role_art` na tabela `articles`.
- Migrações SQL para criação da tabela `news` com foreign keys, constraints e índices.
- Foreign keys, constraints CHECK e índices nas tabelas `articles` e `news` para `usuario_id` e `role_art`.
- Trigger para atualização automática de `updated_at` na tabela `news`.
- Full-text search index (GIN) na tabela `news` para busca em português.

### **🛠️ Changed**

- Tabela `articles` atualizada com novos campos `usuario_id` (foreign key para `users.id`) e `role_art` (enum: 1:root, 2:admin, 3:client) com valor padrão 3.
- Model `Article` atualizado com campos `usuario_id` e `role_art`.
- DTO `CreateArticleDto` atualizado para incluir campos opcionais `usuario_id` e `role_art`.
- `ArticlesService` atualizado com novos métodos: `createClientArticle`, `updateClientArticle`, `findClientArticleById`, `findClientArticlesByUserId`, `deleteClientArticle`, `deleteManyClientArticles`.
- `ArticlesRepository` atualizado com métodos específicos para clientes: `findArticleByIdAndUserId`, `findArticlesByUserId`, `deleteArticleByUserId`, `deleteManyArticles`.
- `ArticlesModule` atualizado para incluir `ClientArticlesController`, novos use cases de client articles e importação de `AuthModule` e `UserModule`.
- `CreateClientArticleUseCase` atualizado para buscar automaticamente o nickname do autor do usuário quando não fornecido.
- `CreateNewsUseCase` atualizado para buscar automaticamente o `role_art` do usuário baseado no role quando não fornecido explicitamente.
- Schema SQL inicial (`01-schema.sql`) atualizado para incluir novos campos em `articles` e definição completa da tabela `news`.
- Script de migração (`02-migration-articles-news.sql`) criado para aplicar mudanças em bancos existentes de forma idempotente.

### **🐛 Fixed**

- Corrigido import absoluto em `create-client-article.use-case.ts` para usar import relativo conforme `.cursorrules`.
- Corrigido tipo de retorno em `findRoleByUserId` no `NewsRepository` para `Role | null`.
- Corrigido tratamento de `role_art` em `CreateNewsUseCase` para converter corretamente string de role (ex: "root") para número do enum (1, 2, 3).
- Corrigido erro de TypeScript relacionado a atribuição de `readonly` properties em DTOs nos controllers de client articles e news.

### **🛑 Security**

- Implementada validação de propriedade para garantir que clientes só possam criar, editar, visualizar e deletar seus próprios artigos e notícias.
- Proteção de todas as rotas de client articles e news com `AuthGuard` para autenticação obrigatória.
- Validação de `usuario_id` nos controllers para prevenir que usuários modifiquem dados de outros usuários.
- Implementada verificação de propriedade nos use cases de delete para garantir que apenas o dono do artigo/notícia possa excluí-lo.
- Uso de `usuario_id` extraído do token JWT para garantir integridade dos dados.

---

# **[1.2.0]- 2026-01-13**

### **✨ Added**

- Sistema completo de comentários em artigos com suporte a respostas aninhadas.
- Endpoints para CRUD de comentários (`GET /api/comments`, `POST /api/comments`, `PUT /api/comments/:id`, `DELETE /api/comments/:id`).
- Sistema de likes/dislikes em comentários (`POST /api/comments/:id/like`, `POST /api/comments/:id/dislike`).
- Busca avançada de artigos com full-text search (`GET /api/articles/search`).
- Sugestões de busca baseadas em títulos de artigos (`GET /api/articles/search/suggestions`).
- Tabelas `comments` e `comment_likes` no banco de dados com índices otimizados.
- Modelos Sequelize `Comment` e `CommentLike` com associações configuradas.
- DTOs para criação, atualização e filtros de comentários.
- DTOs para busca e sugestões de artigos com validação completa.
- Use cases para todas as operações de comentários (CRUD, likes, dislikes).
- Use cases para busca e sugestões de artigos.
- Service `CommentsService` para orquestração de operações de comentários.
- Controller `CommentsController` com rotas protegidas por `AuthGuard`.
- Módulo `CommentsModule` configurado com todas as dependências.
- Sanitização de conteúdo HTML em comentários usando DOMPurify para prevenir XSS.
- Construção de árvore de comentários para exibição hierárquica de respostas.
- Soft delete em comentários para manter histórico.
- Contadores otimizados de likes/dislikes em comentários.
- Índices full-text search (GIN) na tabela `articles` para busca em português.
- Índices adicionais em `articles` para filtros por categoria, tema, autor e visualizações.
- Migrações SQL para criação das tabelas de comentários e atualização de índices de artigos.
- Atualização do schema SQL inicial (`01-schema.sql`) com tabelas de comentários.

### **🛠️ Changed**

- Atualizado `ArticlesService` com métodos `searchArticles` e `getSearchSuggestions`.
- Atualizado `ArticlesController` com rotas de busca (`/search` e `/search/suggestions`).
- Atualizado `ArticleModule` com novos use cases de busca.
- Melhorada estrutura de resposta de comentários com informações de interação do usuário (userLiked, userDisliked).
- Adicionado suporte a filtros e ordenação em listagem de comentários (newest, oldest, mostLiked).
- Adicionado suporte a paginação em comentários e busca de artigos.

### **🐛 Fixed**

- Corrigido erro de TypeScript no modelo `CommentLike` relacionado ao decorador `@Unique`.
- Corrigido exportação de `Article` e `Curiosities` no arquivo `index.model.ts`.
- Corrigido tipo de `options` em `CreateQuestionsDto` para aceitar array de strings diretamente.
- Corrigido transformação de `quiz_level_id` e `quiz_id` de string para number nos DTOs.

### **🛑 Security**

- Implementada sanitização de conteúdo HTML em comentários usando DOMPurify para prevenir ataques XSS.
- Adicionadas validações de permissões para edição e exclusão de comentários (usuário só pode editar/deletar próprios comentários, admins podem deletar qualquer comentário).
- Adicionadas dependências `dompurify` e `jsdom` para sanitização segura de conteúdo HTML.

---



# **[1.1.1]- 2026-01-02**

### **✨ Added**

- Suporte para variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` na configuração do Sequelize.
- Configuração para uso automático da service_role_key do Supabase quando disponível, permitindo bypass do RLS (Row Level Security).

### **🛠️ Changed**

- Modificação da configuração do Sequelize para priorizar `SUPABASE_SERVICE_ROLE_KEY` sobre a senha da `DATABASE_URL` quando definida.
- Ajuste na configuração para usar usuário 'postgres' quando service_role_key estiver configurada.

### **🐛 Fixed**

- Adição de `IF NOT EXISTS` nos índices da tabela `validations` para evitar erros de duplicação durante migrações.
- Correção na configuração de acesso ao banco de dados Supabase com RLS ativado.

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

- Implementação de acesso seguro ao banco Supabase utilizando service_role_key para operações server-side, mantendo RLS ativo para outras conexões.

---

# **[1.1.0]- 2025-08-23**

### **✨ Added**

- Adição de rota para atualização de senha na controller auth.
- Adição do metodo de atualização da senha na authService.
- Criação use-case que processa a sona senha e atualiza a senha no banco, converte em hash antes de salvar.
- Criação do metodo de persistencia da nova senha no banco dentro do userRepository.

### **🛠️ Changed**

- Adição de metodo para alteração de senha na controller de auth.
- Adição de metodo para chamar use-case para alteração de senha na AuthService.
- Adição de metodo para atualizar senha na userService.
- Declaração do provider AuthChangePasswordUseCase no module AuthModule.

---

# **[1.0.1]- 2025-08-21**

### **✨ Added**

- Criação de rota para login social com o Google.
- Criação de metodo na authService para login social com google.
- Criação da AuthSignInGoogleUseCase para conter as regras de login com usuário do google.
- Criação de metodos para criação de usuário e usuário social no banco na authRepository.
- Criação de Model da UserSocialModel para persit^ncia no banco.
- Criação de migration e script no database unit para criação de tabela user_social no banco de dados.

### **🛠️ Changed**

- Inclusão de metodo na AuthService para direcionamento para AuthSignInGoogleUseCase que faz o login com o usuário do google.
- Declaração da AuthSignInGoogleUseCase no module AuthModule.
- Inclusão de metodos para salvar usuário e usuário social no banco.
- Atualização do arquivo README.md.

### **🐛 Fixed**

- 

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

-

---
