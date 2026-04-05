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

test('crear préstamo, devolver y filtrar por estado', async ({ page }) => {
  await login(page);
  await page.goto('/prestamos');

  await expect(page.getByRole('heading', { name: 'Préstamos de Expedientes', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Registrar préstamo' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Registrar préstamo')).toBeVisible();

  const expedienteSelect = dialog.getByRole('combobox').nth(0);
  await expedienteSelect.click({ force: true });
  await expedienteSelect.press('ArrowDown');
  await expedienteSelect.press('Enter');

  const dependenciaSelect = dialog.getByRole('combobox').nth(1);
  await dependenciaSelect.click({ force: true });
  await dependenciaSelect.press('ArrowDown');
  await dependenciaSelect.press('Enter');

  await dialog.locator('#fechaPrestamo').fill('2026-04-05');
  await dialog.locator('#fechaDevolucionEsperada').fill('2026-04-12');
  await dialog.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.ant-notification-notice-title').filter({ hasText: 'Préstamo registrado' })).toBeVisible();

  const registrarDevolucionButton = page.getByRole('button', { name: /Registrar devolución/i }).first();
  await expect(registrarDevolucionButton).toBeVisible();
  await registrarDevolucionButton.click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('.ant-tag').filter({ hasText: 'Devuelto' }).first()).toBeVisible();

  await page.locator('#estado').first().click({ force: true });
  await page.getByText('Vencido').last().click();
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();

  await expect(page.locator('tr.sgde-row-vencido')).toHaveCount(1);
});
