# GasControl Frontend

Aplicação Next.js (App Router) para registrar e consultar relatórios de consumo. Inclui testes E2E com Playwright e unitários com Vitest.

## Requisitos

- Node 18+ e npm.
- Para E2E, navegadores do Playwright instalados localmente.

## Após clonar (setup rápido)

- Instalar dependências:
  npm install

- Instalar navegadores do Playwright (necessário para E2E):
  npx playwright install

- Configurar variáveis de ambiente:
  - Se existir .env.example:
    cp .env.example .env.local
  - Ou crie .env.local e adicione:
    VITE_API_BASE_URL=http://127.0.0.1:8000

## Scripts

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

- Login com usuário de teste.
- Acesso à página “Relatórios”.
- Criação de relatório:
  - Tipo: TORRE
  - Referência ID: 10
  - Data início: 2025-08-10
  - Data fim: 2025-09-10
  - Total consumo: 300
- Tratamento do alert de sucesso (aguarda “dialog”, valida mensagem e aceita).
- Exportação de CSV (aguarda download e verifica nome sugerido).

Execução inicial:

- npm install -D @playwright/test
- npx playwright install
- npm run e2e

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
  - Regras: tipo obrigatório, datas obrigatórias, “início não pode ser maior que fim”.
- tests/unit/format.spec.ts
  - formatPeriodo: “dd/mm/yyyy - dd/mm/yyyy”.
  - toDecimal: “12,50” → 12.5; inválidos → 0.

Execução:

- npm run test
- npm run test:run

## Variáveis de ambiente

Crie .env.local:
VITE_API_BASE_URL=http://127.0.0.1:8000

## Usuário de teste

- Login: Daniel
- Senha: 123mudar

## Troubleshooting

- Alert não clicável no E2E:

  - Registre page.waitForEvent("dialog") antes do submit; valide a mensagem e chame dialog.accept().

- Conflito de runners (Vitest pegando E2E):

  - Mantenha unit em tests/unit e e2e em tests/e2e; configure include/exclude no Vitest para apenas tests/unit.

- Aviso allowedDevOrigins (Next em dev):
  - Aviso informativo em desenvolvimento; pode ser configurado explicitamente em versões futuras do Next.
