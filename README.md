# GasControl Frontend

Aplicação Next.js (App Router) para registrar e consultar relatórios de consumo. Inclui testes E2E com Playwright e unitários com Vitest.

## Requisitos

- Node 18+ e npm.
- Docker e Docker Compose instalados.
- Para E2E, navegadores do Playwright instalados localmente.

## Backend: Setup com Docker Compose

O frontend consome uma API Django que roda em container Docker. Siga estes passos para configurar o backend:

### 1) Clonar o repositório do backend

git clone [URL_DO_REPOSITORIO_BACKEND]
cd gascontrol-backend

### 2) Configurar variáveis de ambiente

Crie um arquivo `.env` no diretório do backend:

# Banco de dados PostgreSQL

POSTGRES_DB=gascontrol
POSTGRES_USER=gascontrol_user
POSTGRES_PASSWORD=sua_senha_aqui

# Django

DJANGO_SECRET_KEY=sua_chave_secreta_django
DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

### 3) Subir os serviços

# Build e start dos containers (Django + PostgreSQL)

docker compose up -d --build

# Verificar se os containers estão rodando

docker compose ps

### 4) Configurar banco de dados

# Aplicar migrações

docker compose exec web python manage.py migrate

# O superusuário já está criado com as credenciais:

# Usuário: Daniel

# Senha: 123mudar

# (Caso precise recriar: docker compose exec web python manage.py createsuperuser)

### 5) Verificar endpoints

Após o setup, a API estará disponível em:

- API Base: http://127.0.0.1:8000
- Admin Django: http://127.0.0.1:8000/admin/ (use: Daniel / 123mudar)
- Documentação (se configurada): http://127.0.0.1:8000/api/doc/
- Endpoints principais: http://127.0.0.1:8000/api/relatorios/

### 6) Comandos úteis do backend

# Parar containers

docker compose down

# Ver logs da API

docker compose logs -f web

# Acessar shell do Django

docker compose exec web python manage.py shell

# Rebuild em caso de mudanças no código

docker compose up -d --build

## Frontend: Setup após clonar

### Instalação

# Instalar dependências

npm install

# Instalar navegadores do Playwright (necessário para E2E)

npx playwright install

# Configurar variáveis de ambiente

cp .env.example .env.local # se existir .env.example

# ou crie .env.local e adicione:

# VITE_API_BASE_URL=http://127.0.0.1:8000

### Scripts

- Desenvolvimento:
  npm run dev

- Build:
  npm run build

- Testes E2E (Playwright):
  npm run e2e

- Testes unitários (Vitest):
  npm run test # modo watch
  npm run test:run # execução única (CI)

Nota:

- O Playwright inicia o servidor do Next automaticamente via webServer na configuração ao rodar E2E; não é necessário iniciar npm run dev separadamente.

## Testes E2E (Playwright)

Fluxo coberto:

- Login com usuário de teste (Daniel / 123mudar).
- Acesso à página "Relatórios".
- Criação de relatório:
  - Tipo: TORRE
  - Referência ID: 10
  - Data início: 2025-08-10
  - Data fim: 2025-09-10
  - Total consumo: 300
- Tratamento do alert de sucesso (aguarda "dialog", valida mensagem e aceita).
- Exportação de CSV (aguarda download e verifica nome sugerido).

Execução inicial:
npm install -D @playwright/test
npx playwright install
npm run e2e

Estrutura:

- tests/e2e/registro-leitura.spec.ts

Boas práticas:

- Use data-testid em form e campos para seletores estáveis.
- Registre page.waitForEvent("dialog") antes do submit que dispara o alert.

## Testes unitários (Vitest)

Pasta:

- tests/unit (separada de tests/e2e)

Stack:

- Vitest + jsdom + vite-tsconfig-paths (aliases do tsconfig)

Incluídos:

- tests/unit/validate-relatorio.spec.ts
  - Regras: tipo obrigatório, datas obrigatórias, "início não pode ser maior que fim".
- tests/unit/format.spec.ts
  - formatPeriodo: "dd/mm/yyyy - dd/mm/yyyy".
  - toDecimal: "12,50" → 12.5; inválidos → 0.

Execução:
npm run test
npm run test:run

## Variáveis de ambiente

Frontend (.env.local):
VITE_API_BASE_URL=http://127.0.0.1:8000

## Credenciais de acesso

### Usuário Admin (Backend Django)

- Usuário: Daniel
- Senha: 123mudar
- Acesso: http://127.0.0.1:8000/admin/

### Usuário de teste (Frontend)

- Login: Daniel
- Senha: 123mudar

## Troubleshooting

### Backend

- Containers não sobem: verifique se as portas 8000 e 5432 estão livres
- Erro de conexão de banco: confirme se as variáveis .env estão corretas
- Django mostra "Install successful": normal, API está em /api/... endpoints

### Frontend

- Alert não clicável no E2E:

  - Registre page.waitForEvent("dialog") antes do submit; valide a mensagem e chame dialog.accept().

- Conflito de runners (Vitest pegando E2E):

  - Mantenha unit em tests/unit e e2e em tests/e2e; configure include/exclude no Vitest para apenas tests/unit.

- Aviso allowedDevOrigins (Next em dev):
  - Aviso informativo em desenvolvimento; pode ser configurado explicitamente em versões futuras do Next.
