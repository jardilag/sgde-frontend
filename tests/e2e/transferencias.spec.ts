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

test('registrar transferencia, consultar elegibles, filtrar y descargar inventario', async ({ page }) => {
  await login(page);
  await page.goto('/transferencias');

  await expect(page.getByRole('heading', { name: 'Transferencias Documentales', exact: true })).toBeVisible();
  await expect(page.getByText('Elegibles para transferencia')).toBeVisible();

  await page.getByRole('button', { name: 'Registrar transferencia' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Registrar transferencia documental')).toBeVisible();

  const expedienteSelect = dialog.getByRole('combobox').nth(1);
  await expedienteSelect.click({ force: true });
  await expedienteSelect.press('ArrowDown');
  await expedienteSelect.press('Enter');
  await expect(dialog.locator('.ant-select-selection-item')).toBeVisible();

  await dialog.locator('#fechaTransferencia').fill('2026-04-05');
  await dialog.getByRole('button', { name: 'Registrar transferencia' }).click();
  await expect(dialog).not.toBeVisible();

  await expect(page.locator('.ant-notification-notice-title').filter({ hasText: 'Transferencia registrada' })).toBeVisible();

  await page.locator('#tipoTransferencia').first().click({ force: true });
  await page.getByText('Primaria').last().click();
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await expect(page.getByRole('heading', { name: 'Listado de transferencias' })).toBeVisible();

  await page.getByRole('button', { name: /Descargar inventario/i }).first().click();
  await expect(page.locator('.ant-notification-notice-title').filter({ hasText: 'Inventario disponible' })).toBeVisible();
});
