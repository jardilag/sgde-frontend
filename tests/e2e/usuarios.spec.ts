import { expect, test } from '@playwright/test';

async function login(page: Parameters<typeof test>[0]['page']) {
  await page.goto('/login');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test('búsqueda y acciones de usuarios', async ({ page }) => {
  await login(page);
  await page.goto('/usuarios');

  await expect(page.getByRole('heading', { name: 'Usuarios', exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar por nombre, correo, rol o dependencia')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nuevo usuario' }).first()).toBeVisible();

  await page.getByPlaceholder('Buscar por nombre, correo, rol o dependencia').fill('Andrea Castro');
  await expect(page.getByText('andrea.castro@sgde.gov.co')).toBeVisible();
  await expect(page.getByRole('button', { name: /editar/i }).first()).toBeVisible();
});