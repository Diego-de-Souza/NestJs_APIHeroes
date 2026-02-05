# Arquitetura Híbrida Clean / Hexagonal

Este documento descreve a estrutura de **ports e use cases** usada no projeto: o fluxo das requisições segue **Clean/Hexagonal**, com separação clara de responsabilidades.

## Fluxo das requisições

```
Controller  →  Port IN (application/ports/in)  →  UseCase  →  Port OUT (application/ports/out)  →  Repository
```

- **Controller**: recebe a requisição e depende **apenas** dos **Ports IN** (contratos).
- **Port IN**: contrato (interface) que o controller usa; é **implementado** pelo **UseCase**.
- **UseCase**: regras de aplicação; depende **apenas** dos **Ports OUT** (contratos de persistência/serviços).
- **Port OUT**: contrato (interface) que o use case usa; é **implementado** pelo **Repository** (ou outro adapter).
- **Repository**: implementa o Port OUT e acessa banco de dados ou APIs externas.

Não há mais a camada **Service** entre Controller e UseCase: o controller chama diretamente o port (use case).

## Estrutura de pastas

```
src/
├── application/
│   ├── ports/
│   │   ├── in/                    # Ports IN (contratos para o controller)
│   │   │   └── newsletter/        # por contexto (newsletter, user, etc.)
│   │   │       ├── create-newsletter.port.ts
│   │   │       ├── get-list-newsletter.port.ts
│   │   │       ├── find-news-by-id.port.ts
│   │   │       ├── update-news.port.ts
│   │   │       ├── delete-news.port.ts
│   │   │       ├── delete-many-news.port.ts
│   │   │       └── index.ts
│   │   └── out/                    # Ports OUT (contratos para os use cases)
│   │       └── newsletter.port.ts   # ex: INewsletterRepository
│   └── use-cases/
│       └── news/
│           ├── create-newsletter.use-case.ts   # implementa ICreateNewsletterPort, usa INewsletterRepository
│           ├── find-news-by-user-id.use-case.ts
│           ├── find-news-by-id.use-case.ts
│           ├── update-news.use-case.ts
│           ├── delete-news.use-case.ts
│           └── delete-many-news.use-case.ts
│
├── infrastructure/
│   └── repositories/
│       └── news.repository.ts     # implementa INewsletterRepository
│
├── interface/
│   ├── controllers/
│   │   └── news.controller.ts     # injeta apenas Ports IN, chama port.execute(...)
│   └── modules/
│       └── news.module.ts         # registra Port IN → UseCase, Port OUT → Repository
│
└── domain/
    └── interfaces/                # DTOs e interfaces de domínio
```

## Como refatorar um módulo (passo a passo)

### 1. Criar Ports IN (application/ports/in/{contexto})

- Uma interface por ação (create, findById, update, delete, etc.).
- Método único: `execute(...): Promise<ApiResponseInterface<T>>` (ou o retorno que fizer sentido).

Exemplo:

```ts
// application/ports/in/newsletter/find-news-by-id.port.ts
export interface IFindNewsByIdPort {
    execute(id: number, usuario_id: number): Promise<ApiResponseInterface<News>>;
}
```

### 2. Garantir Port OUT (application/ports/out)

- Uma interface por “repositório” ou serviço externo (ex.: `INewsletterRepository`).
- O use case depende dessa interface; o repository concreto implementa.

### 3. Use cases

- Cada use case **implementa** um Port IN e **injeta** o Port OUT (ex.: `INewsletterRepository`).
- Método público: `execute(...)` igual à assinatura do Port IN.
- Não injetar o repository concreto; injetar sempre a interface (Port OUT).

Exemplo:

```ts
@Injectable()
export class FindNewsByIdUseCase implements IFindNewsByIdPort {
    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ) {}
    async execute(id: number, usuario_id: number): Promise<ApiResponseInterface<News>> {
        // ...
    }
}
```

### 4. Controller

- Remover dependência de **Service**.
- Injetar apenas **Ports IN** (um por use case que o controller usa).
- Chamar `this.xxxPort.execute(...)` em cada rota.

Exemplo:

```ts
constructor(
    @Inject('IFindNewsByIdPort') private readonly findNewsByIdPort: IFindNewsByIdPort
) {}
// ...
return await this.findNewsByIdPort.execute(id, usuario_id);
```

### 5. Module (NestJS)

- **Port IN** → implementado pelo UseCase:  
  `{ provide: 'IFindNewsByIdPort', useClass: FindNewsByIdUseCase }`
- **Port OUT** → implementado pelo Repository:  
  `{ provide: 'INewsletterRepository', useClass: NewsRepository }`
- Remover o **Service** dos `providers` e `exports` (e o arquivo do service, se não for mais usado).

## Módulo de exemplo: News

O módulo **News** já está refatorado e serve de referência:

- **Ports IN**: `application/ports/in/newsletter/*`
- **Port OUT**: `application/ports/out/newsletter.port.ts` (`INewsletterRepository`)
- **Controller**: `interface/controllers/news.controller.ts` (só ports IN)
- **Use cases**: `application/use-cases/news/*` (implementam ports IN, usam port OUT)
- **Repository**: `infrastructure/repositories/news.repository.ts` (implementa `INewsletterRepository`)
- **Module**: `interface/modules/news.module.ts` (bindings Port IN → UseCase, Port OUT → Repository)

---

## Módulos já refatorados

| Módulo   | Ports IN (application/ports/in)     | Port OUT (application/ports/out) | Service removido |
|----------|--------------------------------------|----------------------------------|------------------|
| **News** | newsletter/* (6 ports)               | newsletter.port.ts              | Sim (NewsService) |
| **Comments** | comments/* (7 ports)            | comments.port.ts                | Sim (CommentsService) |

## Módulos pendentes (mesmo padrão)

Seguir o mesmo fluxo para cada um:

- **Events** – create, get all, delete, list home → ports in/out, remover EventsService
- **Studio** – create, find all, find by id, update, delete → ports in/out, remover StudioService
- **Team** – create, find all, find by id → ports in/out, remover TeamService
- **Games** – create, update, delete, find all, memory game, user progress, etc. → ports in/out, remover GamesService
- **Dados-herois (Heroes)** – create, update, delete, find all, find by id, etc. → ports in/out, remover DataHeroesService
- **Dashboard** – find dashboard → port in/out, remover DashboardService
- **Highlights** – find highlights → port in/out, remover HighlightsService
- **Auth** – signin, refresh, google, change password, 2FA, logout, etc. → ports in/out (AuthService pode permanecer como orquestrador ou cada ação virar port)
- **User** – create, find all, find by id, update → ports in/out, remover UserService
- **Article/Articles** – create, update, find, etc. → ports in/out, remover ArticlesService
- **Notifications** – create, find, delete, mark read → ports in/out, remover NotificationsService
- **Quiz** – create, find, update, answer, etc. → ports in/out, remover QuizService
- **Sac** – contacts, responses → ports in/out, remover SacService
- **Payment** – plans, create intent, webhook, etc. → ports in/out, remover PaymentService
- **Menu_principal** – get all → port in/out, remover MenuPrincipalService

Para cada módulo: criar ports IN em `application/ports/in/{contexto}`, criar ou ajustar port OUT em `application/ports/out`, refatorar use cases (implementar port IN, injetar port OUT), refatorar controller (injetar só ports IN), ajustar module (bindings, remover Service) e remover o arquivo do Service.
