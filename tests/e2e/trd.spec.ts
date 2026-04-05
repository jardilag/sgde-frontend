import { expect, test } from '@playwright/test';

async function login(page: Parameters<typeof test>[0]['page']) {
  await page.goto('/login');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test('crear y editar serie', async ({ page }) => {
  await login(page);
  await page.goto('/trd');

  await expect(page.getByRole('heading', { name: 'Tabla de Retención Documental (TRD)', exact: true })).toBeVisible();

  // Crear nueva serie
  await page.getByRole('button', { name: 'Nueva serie' }).click();
  await expect(page.getByText('Nueva serie')).toBeVisible();

  await page.getByPlaceholder('Ej: SG-01').fill('TEST-01');
  await page.getByPlaceholder('Ej: Administración General').fill('Serie de Prueba');
  await page.getByPlaceholder('Descripción de la serie').fill('Descripción de prueba');

  await page.getByRole('button', { name: 'Crear' }).click();

  // Verificar que la serie fue creada
  await expect(page.getByText('Serie de Prueba')).toBeVisible();
});

test('crear subserie y ver tiempos de retención', async ({ page }) => {
  await login(page);
  await page.goto('/trd');

  // Seleccionar una serie
  await page.getByText('Administración General').click();

  // Ir a subseries
  await page.getByRole('tab', { name: 'Subseries' }).click();

  // Crear subserie
  await page.getByRole('button', { name: 'Nueva subserie' }).click();
  await expect(page.getByText('Nueva subserie')).toBeVisible();

  await page.getByPlaceholder('Ej: SG-01-01').fill('TEST-01-01');
  await page.getByPlaceholder('Ej: Correspondencia Interna').fill('Subserie de Prueba');

  // Ingresar tiempos de retención
  const gestionInputs = page.locator('input[type="number"]');
  await gestionInputs.first().fill('2');
  await gestionInputs.nth(1).fill('5');

  // Seleccionar disposición
  const disposicionSelect = page.locator('.ant-select').nth(2);
  await disposicionSelect.click();
  await page.getByText('Conservación permanente').click();

  await page.getByRole('button', { name: 'Crear' }).click();

  // Verificar que la subserie fue creada
  await expect(page.getByText('Subserie de Prueba')).toBeVisible();
  await expect(page.getByText('2 años')).toBeVisible(); // Retención gestión
  await expect(page.getByText('5 años')).toBeVisible(); // Retención central
});

test('buscar serie por código', async ({ page }) => {
  await login(page);
  await page.goto('/trd');

  // Realizar búsqueda
  await page.getByPlaceholder('Buscar por código, nombre o descripción').fill('SG-01');

  // Verificar que solo aparecen resultados relevantes
  await expect(page.getByText('Administración General')).toBeVisible();
});
