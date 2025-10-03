import { test, expect } from '@playwright/test';

test('Registro de leitura e exportação CSV', async ({ page }) => {
  // 1) Login
  await page.goto('/login');
  await page.getByPlaceholder(/usuário/i).fill('Daniel');
  await page.getByPlaceholder(/senha/i).fill('123mudar');
  await Promise.all([
    page.waitForURL('**/relatorios'),
    page.getByRole('button', { name: /entrar/i }).click(),
  ]);

  // 2) Confirma que está na página de Relatórios (H1 específico)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Relatórios' }),
  ).toBeVisible();

  // 3) Formulário de criação (use data-testid no componente do form)
  //    <form ... data-testid="relatorio-form"> e nos campos:
  //    data-testid="tipo-select" | "referencia-input" | "inicio-input" | "fim-input" | "consumo-input"
  const form = page.getByTestId('relatorio-form');

  await form.getByTestId('tipo-select').selectOption({ value: 'TORRE' });
  await form.getByTestId('referencia-input').fill('10');
  await form.getByTestId('inicio-input').fill('2025-08-10'); // 10 de agosto (formato ISO)
  await form.getByTestId('fim-input').fill('2025-09-10'); // 10 de setembro
  await form.getByTestId('consumo-input').fill('300');

  // 4) Enviar e tratar o alert() de sucesso
  // Registrar listener ANTES do clique
  const dialogPromise = page.waitForEvent('dialog', { timeout: 10000 });
  await form.getByRole('button', { name: /criar/i }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toMatch(/Relatório incluso com sucesso/i);
  await dialog.accept();

  await Promise.race([
    page.waitForURL('**/relatorios', { timeout: 5000 }),
    page
      .getByRole('heading', { level: 1, name: 'Relatórios' })
      .waitFor({ timeout: 5000 }),
  ]).catch(() => {});

  // 6) Exportar CSV e validar o download
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /exportar csv/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename().toLowerCase()).toContain('relatorios');
});
