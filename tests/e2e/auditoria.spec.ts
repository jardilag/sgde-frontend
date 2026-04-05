import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function login(page: Page) {
  await page.context().addCookies([
    {
      name: 'sgde_session',
      value: 'demo-session-token',
      url: 'http://127.0.0.1:3000',
    },
  ]);
}

test('consultar auditoría, filtrar por usuario y fechas, y limpiar filtros', async ({ page }) => {
  await login(page);
  await page.goto('/auditoria');

  await expect(page.getByRole('heading', { name: 'Auditoría del Sistema', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Historial de auditoría' })).toBeVisible();

  await page.locator('#usuario').first().click({ force: true });
  await page.getByText('Andrea Castro').last().click();
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await expect(page.getByText('Andrea Castro').first()).toBeVisible();

  await page.getByLabel('Fecha desde').fill('2026-04-04');
  await page.getByLabel('Fecha hasta').fill('2026-04-05');
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await expect(page.getByText('Transferencia').first()).toBeVisible();

  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(page.getByRole('heading', { name: 'Historial de auditoría' })).toBeVisible();
});
