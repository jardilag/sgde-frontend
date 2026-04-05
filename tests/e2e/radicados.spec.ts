import { expect, test } from '@playwright/test';

async function login(page: Parameters<typeof test>[0]['page']) {
  await page.goto('/login');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test('búsqueda y acciones de radicados', async ({ page }) => {
  await login(page);
  await page.goto('/radicados');

  await expect(page.getByRole('heading', { name: 'Radicados', exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar por número, asunto, remitente o dependencia')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nuevo radicado' }).first()).toBeVisible();

  await page.getByPlaceholder('Buscar por número, asunto, remitente o dependencia').fill('RAD-2026-0001');
  await expect(page.getByText('Solicitud de acceso a expediente')).toBeVisible();
  await expect(page.getByRole('button', { name: /editar/i }).first()).toBeVisible();
});