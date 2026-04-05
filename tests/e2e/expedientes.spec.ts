import { expect, test } from '@playwright/test';

async function login(page: Parameters<typeof test>[0]['page']) {
  await page.goto('/login');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test('crear expediente', async ({ page }) => {
  await login(page);
  await page.goto('/expedientes');

  await expect(page.getByRole('heading', { name: 'Expedientes Archivísticos' })).toBeVisible();

  await page.locator('.ant-float-btn-primary').first().click();
  const drawer = page.locator('.ant-drawer-content-wrapper').last();
  await expect(drawer.locator('.ant-drawer-title')).toHaveText('Nuevo expediente');

  await drawer.getByPlaceholder('EXP-2026-0001').fill('EXP-2026-0099');
  await drawer.getByPlaceholder('Nombre del expediente').fill('Expediente E2E de prueba');

  await drawer.getByRole('button', { name: 'Crear' }).click();
  await expect(page.getByText('Expediente E2E de prueba')).toBeVisible();
});

test('filtrar expedientes', async ({ page }) => {
  await login(page);
  await page.goto('/expedientes');

  await page.getByText('Filtros Avanzados').click();
  await page.getByPlaceholder('EXP-2026-0001').fill('EXP-2026-0001');
  await page.getByRole('button', { name: 'Filtrar' }).click();

  await expect(page.getByText('EXP-2026-0001')).toBeVisible();
});

test('abrir detalle de expediente', async ({ page }) => {
  await login(page);
  await page.goto('/expedientes');

  const firstRow = page.locator('.ant-table-tbody tr').first();
  await firstRow.locator('button').first().click();

  await expect(page.getByText('Detalle:')).toBeVisible();
  await expect(page.getByText('Información General')).toBeVisible();
});

test('cerrar expediente', async ({ page }) => {
  await login(page);
  await page.goto('/expedientes');

  const openRow = page.locator('.ant-table-tbody tr', { hasText: 'Abierto' }).first();
  await openRow.locator('button').first().click();

  const drawer = page.locator('.ant-drawer-content-wrapper').last();
  await drawer.locator('button:has-text("Cerrar")').first().click();
  await page.locator('.ant-modal-confirm-btns .ant-btn-dangerous').click();
  await expect(page.locator('.ant-table-tbody tr', { hasText: 'Cerrado' }).first()).toBeVisible();
});

test('reabrir expediente', async ({ page }) => {
  await login(page);
  await page.goto('/expedientes');

  let closedRow = page.locator('.ant-table-tbody tr', { hasText: 'Cerrado' }).first();

  if ((await closedRow.count()) === 0) {
    const openRow = page.locator('.ant-table-tbody tr', { hasText: 'Abierto' }).first();
    await openRow.locator('button').first().click();
    const closeDrawer = page.locator('.ant-drawer-content-wrapper').last();
    await closeDrawer.locator('button:has-text("Cerrar")').first().click();
    await page.locator('.ant-modal-confirm-btns .ant-btn-dangerous').click();
    closedRow = page.locator('.ant-table-tbody tr', { hasText: 'Cerrado' }).first();
  }

  await closedRow.locator('button').first().click();

  const drawer = page.locator('.ant-drawer-content-wrapper').last();

  await drawer.getByRole('button', { name: 'Reabrir' }).click();
  await page.locator('.ant-modal-confirm .ant-btn-primary').click();
  await expect(page.locator('.ant-modal-confirm')).toHaveCount(0);
});
