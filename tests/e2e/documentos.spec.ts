import { expect, test } from '@playwright/test';

async function login(page: Parameters<typeof test>[0]['page']) {
  await page.context().addCookies([
    {
      name: 'sgde_session',
      value: 'demo-session-token',
      url: 'http://127.0.0.1:3000',
    },
  ]);
}

test('radica, consulta y filtra documentos', async ({ page }) => {
  await login(page);
  await page.goto('/documentos');

  await expect(page.getByRole('heading', { name: 'Radicación Documental', exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar por radicado, título o dependencia')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nueva radicación' }).first()).toBeVisible();

  await page.getByPlaceholder('Buscar por título').fill('Contrato');
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await expect(page.getByText('Contrato de prestacion de servicios')).toBeVisible();

  await page.getByRole('button', { name: 'Nueva radicación' }).first().click();
  await expect(page.getByText('Nueva radicación documental')).toBeVisible();

  await page.locator('#tipoDocumento').last().fill('Oficio de prueba');
  await page.locator('#titulo').last().fill('Solicitud de información contractual');
  await page.locator('#fechaDocumento').last().fill('2026-04-05');

  await page.locator('#dependenciaId').last().click({ force: true });
  await page.getByText('Juridica (JUR-003)').click();

  await page.locator('input[type="file"]').last().setInputFiles({
    name: 'radicacion.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n'),
  });

  await page.getByRole('button', { name: 'Radicar' }).click();

  await expect(page.getByText(/Detalle de SGDE-2026-/)).toBeVisible();
  await expect(page.getByText(/sha256-radicacion\.pdf-/)).toBeVisible();
  await expect(page.getByText('Sin vista previa')).toBeVisible();
});

test('rechaza archivos inválidos en radicación', async ({ page }) => {
  await login(page);
  await page.goto('/documentos');

  await page.getByRole('button', { name: 'Nueva radicación' }).first().click();
  await expect(page.getByText('Nueva radicación documental')).toBeVisible();

  await page.locator('#tipoDocumento').last().fill('Oficio de prueba');
  await page.locator('#titulo').last().fill('Documento con archivo inválido');
  await page.locator('#fechaDocumento').last().fill('2026-04-05');
  await page.locator('#dependenciaId').last().click({ force: true });
  await page.getByText('Juridica (JUR-003)').click();

  await page.locator('input[type="file"]').last().setInputFiles({
    name: 'archivo.exe',
    mimeType: 'application/x-msdownload',
    buffer: Buffer.from('MZ'),
  });

  await expect(page.getByText('Solo se permiten archivos PDF, PNG, JPG o DOCX.')).toBeVisible();
});