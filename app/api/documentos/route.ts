import { NextResponse } from 'next/server';
import { createDocumento, listDocumentos } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validateDocumentoPayload } from '@/utils/validators';

function parseFilters(request: Request) {
  const url = new URL(request.url);

  return {
    q: url.searchParams.get('q') ?? '',
    numeroRadicado: url.searchParams.get('numeroRadicado') ?? undefined,
    tipoRadicado: url.searchParams.get('tipoRadicado') ?? undefined,
    dependenciaId: url.searchParams.get('dependenciaId') ?? undefined,
    titulo: url.searchParams.get('titulo') ?? undefined,
    fechaDesde: url.searchParams.get('fechaDesde') ?? undefined,
    fechaHasta: url.searchParams.get('fechaHasta') ?? undefined,
    page: Number(url.searchParams.get('page') ?? '1'),
    pageSize: Number(url.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
  };
}

export async function GET(request: Request) {
  const filters = parseFilters(request);
  const result = listDocumentos(filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    const payload = contentType.includes('multipart/form-data')
      ? Object.fromEntries((await request.formData()).entries())
      : ((await request.json()) as Record<string, unknown>);
    const validation = validateDocumentoPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios de la radicación.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createDocumento(payload as unknown as Parameters<typeof createDocumento>[0]);

    return NextResponse.json({ message: 'Documento radicado correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible radicar el documento.' }, { status: 500 });
  }
}