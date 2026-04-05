import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test('visualizar dashboard completo, refrescar y navegar a módulos', async ({ page }) => {
  await login(page);

  await expect(page.getByRole('heading', { name: /dashboard ejecutivo sgde/i })).toBeVisible();
  await expect(page.getByText('Radicaciones del mes')).toBeVisible();
  await expect(page.getByText('Préstamos activos')).toBeVisible();
  await expect(page.getByText('Préstamos vencidos')).toBeVisible();
  await expect(page.getByText('Transferencias realizadas').first()).toBeVisible();
  await expect(page.getByText('Actividad reciente del sistema')).toBeVisible();
  await expect(page.getByText('Alertas de vencimientos')).toBeVisible();

  await page.getByRole('button', { name: 'Refrescar' }).click();
  await expect(page.getByText('Navegación rápida')).toBeVisible();

  await page.getByRole('main').getByRole('link', { name: 'Documentos' }).click();
  await page.waitForURL('**/documentos');
  await expect(page.getByRole('heading', { name: 'Documentos' })).toBeVisible();
});