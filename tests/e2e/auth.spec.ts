import { expect, test } from '@playwright/test';

test('autenticación demo', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /ingreso al sistema/i })).toBeVisible();
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');

  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page.getByRole('heading', { name: /resumen operativo del sgde/i })).toBeVisible();
});