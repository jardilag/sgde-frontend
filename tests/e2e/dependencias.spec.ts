import { expect, test } from '@playwright/test';

async function login(page: Parameters<typeof test>[0]['page']) {
  await page.goto('/login');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('admin@sgde.gov.co');
  await expect(page.getByLabel('Contraseña')).toHaveValue('SGDE2026!');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test('gestión de dependencias', async ({ page }) => {
  await login(page);
  await page.goto('/dependencias');

  await expect(page.getByRole('heading', { name: 'Dependencias', exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar por nombre, código o descripción')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nueva dependencia' }).first()).toBeVisible();

  // Prueba búsqueda
  await page.getByPlaceholder('Buscar por nombre, código o descripción').fill('Secretaría');
  await expect(page.getByText('Secretaría General')).toBeVisible();

  // Prueba crear dependencia
  await page.getByRole('button', { name: 'Nueva dependencia' }).click();
  await expect(page.getByText('New Dependencia')).toBeVisible();

  const nombreInput = page.getByPlaceholder('Ej: Dirección de Gobernanza');
  const codigoInput = page.getByPlaceholder('Ej: DIR-GOB-001');
  const descripcionInput = page.getByPlaceholder('Descripción de funciones y responsabilidades');

  await nombreInput.fill('Dirección de Innovación');
  await codigoInput.fill('DIN-006');
  await descripcionInput.fill('Gestión de procesos de innovación tecnológica.');

  await page.getByRole('button', { name: 'Crear' }).click();

  // Verificar que la dependencia fue creada
  await expect(page.getByText('Dirección de Innovación')).toBeVisible();

  // Prueba editar dependencia
  await page.goto('/dependencias');
  await page.getByPlaceholder('Buscar por nombre, código o descripción').fill('Dirección de Innovación');
  await expect(page.getByText('Dirección de Innovación')).toBeVisible();

  const editButtons = page.getByRole('button', { name: /editar/i });
  await editButtons.first().click();

  await expect(page.getByText('Editar dependencia')).toBeVisible();
  const descriptionField = page.getByPlaceholder('Descripción de funciones y responsabilidades');
  await descriptionField.clear();
  await descriptionField.fill('Gestión actualizada de procesos de innovación.');
  await page.getByRole('button', { name: 'Actualizar' }).click();

  // Verificar que la dependencia fue actualizada
  await page.goto('/dependencias');
  await page.getByPlaceholder('Buscar por nombre, código o descripción').fill('Dirección de Innovación');
  await expect(page.getByText('Gestión actualizada de procesos de innovación.')).toBeVisible();
});
