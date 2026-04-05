import { NextResponse } from 'next/server';
import { createPrestamo, listPrestamos } from '@/services/mock-db';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { validatePrestamoPayload } from '@/utils/validators';

function parseFilters(request: Request) {
  const url = new URL(request.url);

  return {
    q: url.searchParams.get('q') ?? '',
    page: Number(url.searchParams.get('page') ?? '1'),
    pageSize: Number(url.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)),
    estado: url.searchParams.get('estado') ?? undefined,
    dependenciaSolicitanteId: url.searchParams.get('dependenciaSolicitanteId') ?? undefined,
    expedienteId: url.searchParams.get('expedienteId') ?? undefined,
  };
}

export async function GET(request: Request) {
  const filters = parseFilters(request);
  const result = listPrestamos(filters);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const validation = validatePrestamoPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Revise los campos obligatorios del préstamo.', errors: validation.errors },
        { status: 400 },
      );
    }

    const item = createPrestamo(payload as unknown as Parameters<typeof createPrestamo>[0]);

    return NextResponse.json({ message: 'Préstamo registrado correctamente.', item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'No fue posible registrar el préstamo.' }, { status: 500 });
  }
}
